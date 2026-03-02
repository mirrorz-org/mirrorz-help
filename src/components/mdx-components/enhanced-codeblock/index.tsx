import { clsx } from 'clsx';
import * as stylex from '@stylexjs/stylex';

import { memo, useState } from 'react';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';

import type { Menu, MenuValue, InputType } from './menus';
import CodeBlockMenu from './menus';
import ActualCode from '../codeblock';
import LoadingOverlay from './overlay';
import { TabItem, Tabs } from '../../tabs';

import { buildEchoTee } from './build-code';
import { useMirrorSudoEnabled } from '@/contexts/mirror-enable-sudo';
import { EMPTY_ARRAY } from '../../../lib/client/constant';

import { useRenderCode } from './render-code';

interface CodeBlockProps {
  isHttpProtocol?: boolean,
  menus?: InputType[],
  children: React.ReactNode,
  code: string,
  codeLanguage?: string,
  codeMeta?: string,
  enableQuickSetup?: boolean,
  filepath?: string
}

const styles = stylex.create({
  container: {
    marginBlock: '24px',
    marginInline: '0'
  },
  code_wrapper: {
    position: 'relative'
  },
  p: {
    marginBottom: '16px'
  }
});

function createInitialState(menus: InputType[]): MenuValue {
  return menus.reduce<MenuValue>((acc, menu) => {
    const value = 'items' in menu ? menu.items[0][1] : { [menu.name]: menu.defaultValue || '' };
    acc = { ...acc, ...value };
    return acc;
  }, {});
}

function CodeBlock({
  menus = EMPTY_ARRAY,
  isHttpProtocol = true,
  code,
  codeLanguage,
  enableQuickSetup = false,
  filepath
}: CodeBlockProps) {
  const [variableState, setVariableState] = useState(() => createInitialState(menus));

  const sudoEnabled = useMirrorSudoEnabled();
  const { isLoading: _isLoading } = useMirrorZData();
  const currentSelectedMirror = useSelectedMirror();

  const isLoading = _isLoading || !currentSelectedMirror;

  const finalCode = useRenderCode(code, variableState, isHttpProtocol);

  const codeBlockMenu = menus.length > 0 && <CodeBlockMenu menus={menus} dispatch={setVariableState} />;

  if (enableQuickSetup && filepath) {
    return (
      <div
        {...stylex.props(styles.container)}
        className={clsx('enhanced-codeblock', stylex.props(styles.container).className)}
      >
        {codeBlockMenu}
        <Tabs items={[filepath, '快速配置']}>
          <TabItem value={filepath} xstyle={styles.code_wrapper}>
            <LoadingOverlay isLoading={isLoading} />
            <ActualCode code={finalCode} language={codeLanguage} />
          </TabItem>
          <TabItem value="快速配置" xstyle={styles.code_wrapper}>
            <LoadingOverlay isLoading={isLoading} />
            <ActualCode
              code={buildEchoTee(finalCode, filepath, sudoEnabled)}
              language="bash"
            />
          </TabItem>
        </Tabs>
      </div>
    );
  }

  return (
    <div
      {...stylex.props(styles.container)}
      className={clsx('enhanced-codeblock', stylex.props(styles.container).className)}
    >
      {codeBlockMenu}
      <div {...stylex.props(styles.code_wrapper)}>
        <LoadingOverlay isLoading={isLoading} />
        <ActualCode code={finalCode} language={codeLanguage} />
      </div>
    </div>
  );
}

export default memo(CodeBlock);
