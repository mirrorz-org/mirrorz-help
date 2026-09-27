import { useMemo, use } from 'react';
import type { MenuValue } from './menus';
import { usePageGlobalVariable } from '@/contexts/page-global-variable';
import { useMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import { useMirrorSudoEnabled } from '@/contexts/mirror-enable-sudo';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useResolveSiteCname, useSiteOverrides } from '@/contexts/current-cname';
import { useTemplate } from '@/contexts/compiled-templates';

export function useRenderCode(templateId: string, variables: MenuValue, isHttpProtocol: boolean): string {
  const globalStateValue = usePageGlobalVariable();
  const codeTemplate = useTemplate(templateId);
  const httpsEnabled = useMirrorHttpsEnabled();
  const sudoEnabled = useMirrorSudoEnabled();
  const resolveSiteCname = useResolveSiteCname();
  const siteOverrides = useSiteOverrides();
  const { data, isLoading: _isLoading } = useMirrorZData();
  const currentSelectedMirror = useSelectedMirror();

  const isLoading = _isLoading || !currentSelectedMirror;
  const siteCname = resolveSiteCname(currentSelectedMirror);
  const rewriteRules = currentSelectedMirror ? siteOverrides[currentSelectedMirror]?.rewriteUrl : undefined;

  const mirrorUrl = useMemo(() => {
    if (isLoading || !siteCname) return '(Loading...)';
    return data?.[0][currentSelectedMirror]?.mirrors[siteCname]?.full || '(Loading...)';
  }, [siteCname, currentSelectedMirror, data, isLoading]);

  return useMemo(() => {
    const urlVars: MenuValue = {
      mirror: mirrorUrl
    };
    if (isLoading) {
      urlVars.host = '(Loading...)';
      urlVars.path = '(Loading...)';
      urlVars.scheme = httpsEnabled ? 'https' : 'http';
      urlVars.http_protocol = '';
      urlVars.endpoint = '(Loading...)';
    } else {
      const url = new URL('https://' + mirrorUrl);
      const urlWithScheme = new URL(url);
      urlWithScheme.protocol = httpsEnabled ? 'https:' : 'http:';
      urlVars.host = url.host;
      urlVars.path = url.pathname;
      urlVars.scheme = httpsEnabled ? 'https' : 'http';
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
    const rendered = codeTemplate.render(variable);
    if (isLoading || !rewriteRules) return rendered;
    return rewriteRules.reduce((code, { from, to }) => code.replaceAll(new RegExp(from, 'g'), to), rendered);
  }, [codeTemplate, httpsEnabled, isHttpProtocol, mirrorUrl, sudoEnabled, variables, globalStateValue, isLoading, rewriteRules]);
}
