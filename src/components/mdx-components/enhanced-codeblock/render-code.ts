import { useMemo, use } from 'react';
import type { MenuValue } from './menus';
import { usePageGlobalVariable } from '@/contexts/page-global-variable';
import { useMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import { useMirrorSudoEnabled } from '@/contexts/mirror-enable-sudo';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';
import { buildCode } from './build-code';

export function useRenderCode(codeTemplate: string, variables: MenuValue, isHttpProtocol: boolean): string {
  const globalStateValue = usePageGlobalVariable();

  const httpsEnabled = useMirrorHttpsEnabled();
  const sudoEnabled = useMirrorSudoEnabled();
  const cname = useCurrentCname();
  const { data, isLoading: _isLoading } = useMirrorZData();
  const currentSelectedMirror = useSelectedMirror();

  const isLoading = _isLoading || !currentSelectedMirror;

  const mirrorUrl = useMemo(() => {
    if (isLoading) return '(Loading...)';
    return data?.[0][currentSelectedMirror]?.mirrors[cname].full || '(Loading...)';
  }, [cname, currentSelectedMirror, data, isLoading]);

  return useMemo(() => {
    const urlVars: MenuValue = {
      mirror: mirrorUrl
    };
    if (isLoading) {
      urlVars.host = '(Loading...)';
      urlVars.path = '(Loading...)';
      urlVars.http_protocol = '';
    } else {
      const url = new URL('https://' + mirrorUrl);
      urlVars.host = url.host;
      urlVars.path = url.pathname;
      urlVars.http_protocol = isHttpProtocol ? (httpsEnabled ? 'https://' : 'http://') : '';
    }
    const variable: MenuValue = {
      ...variables,
      ...globalStateValue,
      ...urlVars,
      sudo: sudoEnabled ? 'sudo ' : '',
      sudoE: sudoEnabled ? 'sudo -E ' : ''
    };
    return buildCode(codeTemplate, variable);
  }, [codeTemplate, httpsEnabled, isHttpProtocol, mirrorUrl, sudoEnabled, variables, globalStateValue, isLoading]);
}
