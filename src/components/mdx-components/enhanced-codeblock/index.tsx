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

import { buildCode, buildCatEOF } from './build-code';
import { useMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import { TabItem, Tabs } from '../../tabs';

interface CodeBlockProps {
  isHttpProtocol?: boolean;
  menus?: Menu[];
  children: React.ReactElement;
  code: string;
  codeLanguage?: string;
  codeMeta?: string;
  enableQuickSetup?: boolean;
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
  filepath
}: CodeBlockProps) {
  const [variableState, dispatch] = useReducer(reducer, menus, createInitialState);

  const httpsEnabled = useMirrorHttpsEnabled();
  const cname = useCurrentCname();
  const { data, isLoading } = useMirrorZData();
  const currentSelectedMirror = useSelectedMirror();

  const mirrorUrl = useMemo(() => {
    if (isLoading || !currentSelectedMirror) return '(Loading...)';
    return data?.[0][currentSelectedMirror]?.mirrors[cname].full || '(Loading...)';
  }, [cname, currentSelectedMirror, data, isLoading]);

  const finalCode = useMemo(() => {
    const variable: Record<string, string> = { ...variableState, mirror: mirrorUrl };
    if (isHttpProtocol) {
      variable.http_protocol = httpsEnabled ? 'https://' : 'http://';
    } else {
      variable.http_protocol = '';
    }
    return buildCode(code, variable);
  }, [code, httpsEnabled, isHttpProtocol, mirrorUrl, variableState]);

  const codeBlockMenu = menus.length > 0 && <CodeBlockMenu menus={menus} dispatch={dispatch} />;

  if (enableQuickSetup && filepath) {
    return (
      <div className={clsx('enhanced-codeblock', styles('container'))}>
        {codeBlockMenu}
        <Tabs items={[filepath, '快速配置']}>
          <TabItem value={filepath} xstyle={[styles.code_wrapper]}>
            {(isLoading || !currentSelectedMirror) && <LoadingOverlay />}
            <ActualCode code={finalCode} language={codeLanguage} />
          </TabItem>
          <TabItem value="快速配置" xstyle={[styles.code_wrapper]}>
            {(isLoading || !currentSelectedMirror) && <LoadingOverlay />}
            <p className={styles('p')}>
              如果你当前正在使用的终端 或 Shell 环境不支持复制粘贴时 Shell Escape，「快速配置」的代码可能在复制粘贴的过程中被破坏！
            </p>
            <ActualCode code={buildCatEOF(finalCode, filepath)} language="bash" />
          </TabItem>
        </Tabs>
      </div>
    );
  }

  return (
    <div className={clsx('enhanced-codeblock', styles('container'))}>
      {codeBlockMenu}
      <div className={styles('code_wrapper')}>
        {(isLoading || !currentSelectedMirror) && <LoadingOverlay />}
        <ActualCode code={finalCode} language={codeLanguage} />
      </div>
    </div>
  );
}

export default memo(CodeBlock);
