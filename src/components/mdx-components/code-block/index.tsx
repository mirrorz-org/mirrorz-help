import clsx from 'clsx';
import style9 from 'style9';

import { memo, useMemo, useReducer } from 'react';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';

import type { Menu, MenuValue } from './menus';
import CodeBlockMenu from './menus';
import ActualCode from './code';
import LoadingOverlay from './overlay';

import buildCode from './build-code';
import { useMirrorHttpsEnabled } from '../../../contexts/mirror-enable-https';

interface CodeBlockProps {
  isHttpProtocol?: boolean;
  menus?: Menu[];
  children: React.ReactElement;
  code: string;
  codeLanguage?: string;
  codeMeta?: string;
}

const styles = style9.create({
  container: {
    margin: '24px 0'
  },
  code_wrapper: {
    position: 'relative'
  }
});

const reducer = (prevState: Record<string, string>, [key, value]: [string | undefined, MenuValue]) => {
  if (typeof value === 'string') {
    if (key) {
      if (prevState[key] === value) return prevState;

      return {
        ...prevState,
        [key]: value
      };
    }
    return prevState;
  }

  return {
    ...prevState,
    ...value
  };
};

const createInitialState = (menus: Menu[]): Record<string, string> => {
  return menus.reduce((acc, menu) => {
    // TODO: prefer object variable in the future
    const value = menu.items[0][1];
    if (typeof value === 'string') {
      if (menu.variableName) {
        acc[menu.variableName] = value;
      }
    } else {
      acc = { ...acc, ...value };
    }
    return acc;
  }, {} as Record<string, string>);
};

function CodeBlock({ menus = [], isHttpProtocol = true, code, codeLanguage }: CodeBlockProps) {
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

  return (
    <div className={clsx('enhanced-codeblock', styles('container'))}>
      <CodeBlockMenu menus={menus} dispatch={dispatch} />
      <div className={styles('code_wrapper')}>
        {(isLoading || !currentSelectedMirror) && <LoadingOverlay />}
        <ActualCode code={finalCode} language={codeLanguage} />
      </div>
    </div>
  );
}

export default memo(CodeBlock);
