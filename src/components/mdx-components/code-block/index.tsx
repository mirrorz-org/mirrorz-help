import clsx from 'clsx';
import CodeBlockMenu from './menus';
import buildCode from './build-code';
import { useMemo, useReducer } from 'react';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '../../../hooks/use-mirrorz-data';
import { useCurrentCname } from '../../../contexts/current-cname';

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

export default function CodeBlock({ menus, isHttpProtocol = true, code }: CodeBlockProps) {
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
  const currentSelectedMirror = useSelectedMirror();
  const { data, isLoading } = useMirrorZData();
  const mirrorUrl = useMemo(() => {
    if (isLoading || !currentSelectedMirror) return '(Loading...)';
    return data?.[0][currentSelectedMirror]?.mirrors[cname].full || '(Loading...)';
  }, [cname, currentSelectedMirror, data, isLoading]);

  return (
    <div className={clsx('enhanced-codeblock')}>
      <CodeBlockMenu menus={finalMenus} dispatch={dispatch} />
      <pre>
        <code>
          {buildCode(
            code,
            { ...state, mirror: mirrorUrl }
          )}
        </code>
      </pre>
    </div>
  );
}
