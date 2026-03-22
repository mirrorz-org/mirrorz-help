import { memo } from 'react';
import type { Menu, MenuValue } from '../enhanced-codeblock/menus';
import CodeBlockMenu from '../enhanced-codeblock/menus';
import { EMPTY_ARRAY } from '../../../lib/client/constant';
import { useSetPageGlobalVariable, usePageGlobalVariable } from '@/contexts/page-global-variable';

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
  const currentState = pageGlobalVars?.[id] || {};
  const setVariableState = (value: MenuValue) => {
    setPageGlobalVars((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  return (
    <div>
      <CodeBlockMenu menus={menus} state={currentState} dispatch={setVariableState} />
    </div>
  );
}

export default memo(GlobalMenu);
