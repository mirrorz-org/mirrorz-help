import clsx from 'clsx';
import style9 from 'style9';

import { memo, useDeferredValue, useMemo, useReducer } from 'react';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';

import CodeBlockMenu from './menus';
import ActualCode from './code';
import LoadingOverlay from './overlay';

import buildCode from './build-code';

const styles = style9.create({
  code_wrapper: {
    position: 'relative'
  }
});

interface Menu {
  title: string;
  variableName: string,
  items: [displayName: string, value: string][];
}

interface CodeBlockProps {
  isHttpProtocol?: boolean;
  menus?: Menu[];
  children: React.ReactElement;
  code: string;
  codeLanguage?: string;
  codeMeta?: string;
}

const enableHttpMenu: Menu = {
  title: '是否启用 HTTPS',
  variableName: 'http_protocol',
  items: [
    ['HTTPS', 'https://'],
    ['HTTP', 'http://']
  ]
};

const reducer = (prevState: Record<string, string>, [key, value]: [string, string]) => {
  if (prevState[key] === value) return prevState;
  return {
    ...prevState,
    [key]: value
  };
};

function CodeBlock({ menus, isHttpProtocol = true, code, codeLanguage }: CodeBlockProps) {
  const finalMenus = useMemo(() => {
    if (isHttpProtocol) {
      if (menus) return [...menus, enableHttpMenu];
      return [enableHttpMenu];
    }
    return menus || [];
  }, [isHttpProtocol, menus]);

  const [state, dispatch] = useReducer(reducer, null, _ => {
    const obj = finalMenus.reduce((acc, menu) => {
      acc[menu.variableName] = menu.items[0][1];
      return acc;
    }, {} as Record<string, string>);

    if (!isHttpProtocol) {
      obj.http_protocol = '';
    }

    return obj;
  });

  const cname = useCurrentCname();
  const currentSelectedMirror = useDeferredValue(useSelectedMirror());
  const { data, isLoading } = useMirrorZData();
  const mirrorUrl = useMemo(() => {
    if (isLoading || !currentSelectedMirror) return '(Loading...)';
    return data?.[0][currentSelectedMirror]?.mirrors[cname].full || '(Loading...)';
  }, [cname, currentSelectedMirror, data, isLoading]);

  return (
    <div className={clsx('enhanced-codeblock')}>
      <CodeBlockMenu menus={finalMenus} dispatch={dispatch} />
      <div className={styles('code_wrapper')}>
        {isLoading && <LoadingOverlay />}
        <ActualCode code={buildCode(code, { ...state, mirror: mirrorUrl })} language={codeLanguage} />
      </div>
    </div>
  );
}

export default memo(CodeBlock);
