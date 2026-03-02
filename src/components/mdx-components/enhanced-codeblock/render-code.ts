import { useMemo, use } from 'react';
import type { MenuValue } from './menus';
import { usePageGlobalVariable } from '@/contexts/page-global-variable';
import { useMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import { useMirrorSudoEnabled } from '@/contexts/mirror-enable-sudo';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';
import type { Template as HoganTemplate } from 'hogan.js';
// @ts-expect-error -- We need to import the template runtime, which lacks types
import HoganRuntime from 'hogan.js/lib/template';

const templateCache = new Map<string, HoganTemplate>();

export function useRenderCode(codeTemplateCode: string, variables: MenuValue, isHttpProtocol: boolean): string {
  const globalStateValue = usePageGlobalVariable();

  const codeTemplate = useMemo(() => {
    if (templateCache.has(codeTemplateCode)) {
      return templateCache.get(codeTemplateCode)!;
    }
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func -- we need to evaluate the code template string to get the render function
    const evaledCode = new Function('', 'return ' + codeTemplateCode)();
    const template = new HoganRuntime.Template(evaledCode) as HoganTemplate;
    templateCache.set(codeTemplateCode, template);
    return template;
  }, [codeTemplateCode]);

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
      urlVars.endpoint = '(Loading...)';
    } else {
      const url = new URL('https://' + mirrorUrl);
      const urlWithScheme = new URL(url);
      urlWithScheme.protocol = httpsEnabled ? 'https:' : 'http:';
      urlVars.host = url.host;
      urlVars.path = url.pathname;
      urlVars.http_protocol = isHttpProtocol ? (httpsEnabled ? 'https://' : 'http://') : '';
      urlVars.endpoint = urlWithScheme.toString();
    }
    const globalMenuValues = Object.values(globalStateValue).reduce((acc, val) => ({ ...acc, ...val }), {});
    const variable: MenuValue = {
      ...variables,
      ...globalMenuValues,
      ...urlVars,
      sudo: sudoEnabled ? 'sudo ' : '',
      sudoE: sudoEnabled ? 'sudo -E ' : ''
    };
    return codeTemplate.render(variable);
  }, [codeTemplate, httpsEnabled, isHttpProtocol, mirrorUrl, sudoEnabled, variables, globalStateValue, isLoading]);
}
