import clsx from 'clsx';
import style9 from 'style9';

import { memo, useMemo, useReducer } from 'react';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';

import type { Menu, MenuValue } from './menus';
import CodeBlockMenu from './menus';
import ActualCode from '../codeblock';
import LoadingOverlay from './overlay';
import { TabItem, Tabs } from '../../tabs';

import { buildCode, buildCatEOF } from './build-code';
import { useMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import { useMirrorSudoEnabled } from '@/contexts/mirror-enable-sudo';

interface CodeBlockProps {
  isHttpProtocol?: boolean;
  menus?: Menu[];
  children: React.ReactElement;
  code: string;
  codeLanguage?: string;
  codeMeta?: string;
  enableQuickSetup?: boolean;
  quickSetupNeedSudo?: boolean
  filepath?: string;
}

const styles = style9.create({
  container: {
    margin: '24px 0'
  },
  code_wrapper: {
    position: 'relative'
  },
  p: {
    marginBottom: '16px'
  }
});

const reducer = (prevState: Record<string, string>, value: MenuValue) => ({
  ...prevState,
  ...value
});

const createInitialState = (menus: Menu[]): Record<string, string> => {
  return menus.reduce((acc, menu) => {
    const value = menu.items[0][1];
    acc = { ...acc, ...value };
    return acc;
  }, {} as Record<string, string>);
};

function CodeBlock({
  menus = [],
  isHttpProtocol = true,
  code,
  codeLanguage,
  enableQuickSetup = false,
  quickSetupNeedSudo = false,
  filepath
}: CodeBlockProps) {
  const [variableState, dispatch] = useReducer(reducer, menus, createInitialState);

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

  const finalCode = useMemo(() => {
    const variable: Record<string, string> = {
      ...variableState,
      mirror: mirrorUrl,
      // eslint-disable-next-line no-nested-ternary -- it's ok
      http_protocol: isHttpProtocol ? (httpsEnabled ? 'https://' : 'http://') : '',
      sudo: sudoEnabled ? 'sudo ' : '',
      sudoE: sudoEnabled ? 'sudo -E ' : ''
    };
    return buildCode(code, variable);
  }, [code, httpsEnabled, isHttpProtocol, mirrorUrl, sudoEnabled, variableState]);

  /** Validation */
  if (process.env.NODE_ENV !== 'production') {
    if (!code.includes('{{') && !enableQuickSetup) {
      // eslint-disable-next-line no-console -- log message
      console.warn('CodeBlock: If you don\' use {{variable}} syntax in your code, and don\'t use "enableQuickSetup", you don\'t have to use <CodeBlock />. The extraneous <CodeBlock /> has code starts with:', code.split('\n')[0]);
    }
  }

  const codeBlockMenu = menus.length > 0 && <CodeBlockMenu menus={menus} dispatch={dispatch} />;

  if (enableQuickSetup && filepath) {
    return (
      <div className={clsx('enhanced-codeblock', styles('container'))}>
        {codeBlockMenu}
        <Tabs items={[filepath, '快速配置']}>
          <TabItem value={filepath} xstyle={[styles.code_wrapper]}>
            <LoadingOverlay isLoading={isLoading} />
            <ActualCode code={finalCode} language={codeLanguage} />
          </TabItem>
          <TabItem value="快速配置" xstyle={[styles.code_wrapper]}>
            <LoadingOverlay isLoading={isLoading} />
            <ActualCode
              code={buildCatEOF(finalCode, filepath, quickSetupNeedSudo && sudoEnabled)}
              language="bash"
            />
          </TabItem>
        </Tabs>
      </div>
    );
  }

  return (
    <div className={clsx('enhanced-codeblock', styles('container'))}>
      {codeBlockMenu}
      <div className={styles('code_wrapper')}>
        <LoadingOverlay isLoading={isLoading} />
        <ActualCode code={finalCode} language={codeLanguage} />
      </div>
    </div>
  );
}

export default memo(CodeBlock);
