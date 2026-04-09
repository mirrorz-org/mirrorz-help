import { memo, useCallback } from 'react';
import type { Menu, MenuValue } from '../enhanced-codeblock/menus';
import CodeBlockMenu from '../enhanced-codeblock/menus';
import { EMPTY_ARRAY } from '../../../lib/client/constant';
import { usePageGlobalVariable, useSetPageGlobalVariable } from '@/contexts/page-global-variable';

interface GlobalMenuProps {
  menus?: Menu[],
  id: string,
  children: React.ReactNode
}

function GlobalMenu({
  menus = EMPTY_ARRAY,
  id
}: GlobalMenuProps) {
  const pageGlobalVars = usePageGlobalVariable();
  const setPageGlobalVars = useSetPageGlobalVariable();
  const variableState = pageGlobalVars[id] ?? {};
  const dispatch: React.Dispatch<React.SetStateAction<MenuValue>> = useCallback((action) => {
    setPageGlobalVars((prev) => {
      const newValue = typeof action === 'function' ? action(prev[id] ?? {}) : action;
      return { ...prev, [id]: newValue };
    });
  }, [id, setPageGlobalVars]);
  return (
    <div>
      <CodeBlockMenu menus={menus} variableState={variableState} dispatch={dispatch} />
    </div>
  );
}

export default memo(GlobalMenu);
