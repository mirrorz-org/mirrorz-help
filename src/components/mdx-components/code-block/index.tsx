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
import { useMirrorHttpsEnabled } from '../../../contexts/mirror-enable-https';

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

const reducer = (prevState: Record<string, string>, [key, value]: [string, string]) => {
  if (prevState[key] === value) return prevState;
  return {
    ...prevState,
    [key]: value
  };
};

function CodeBlock({ menus = [], isHttpProtocol = true, code, codeLanguage }: CodeBlockProps) {
  const [state, dispatch] = useReducer(reducer, null, _ => {
    const obj = menus.reduce((acc, menu) => {
      acc[menu.variableName] = menu.items[0][1];
      return acc;
    }, {} as Record<string, string>);

    if (!isHttpProtocol) {
      obj.http_protocol = '';
    }

    return obj;
  });

  const httpsEnabled = useMirrorHttpsEnabled();
  const cname = useCurrentCname();
  const currentSelectedMirror = useDeferredValue(useSelectedMirror());
  const { data, isLoading } = useMirrorZData();
  const mirrorUrl = useMemo(() => {
    if (isLoading || !currentSelectedMirror) return '(Loading...)';
    return data?.[0][currentSelectedMirror]?.mirrors[cname].full || '(Loading...)';
  }, [cname, currentSelectedMirror, data, isLoading]);

  const finalCode = useMemo(() => {
    const variable: Record<string, string> = { ...state, mirror: mirrorUrl };
    if (isHttpProtocol) {
      variable.http_protocol = httpsEnabled ? 'https://' : 'http://';
    }
    return buildCode(code, variable);
  }, [code, httpsEnabled, isHttpProtocol, mirrorUrl, state]);

  return (
    <div className={clsx('enhanced-codeblock')}>
      <CodeBlockMenu menus={menus} dispatch={dispatch} />
      <div className={styles('code_wrapper')}>
        {isLoading && <LoadingOverlay />}
        <ActualCode code={finalCode} language={codeLanguage} />
      </div>
    </div>
  );
}

export default memo(CodeBlock);
