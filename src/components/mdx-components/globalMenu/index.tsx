import { memo } from 'react';
import type { Menu, MenuValue } from '../enhanced-codeblock/menus';
import CodeBlockMenu from '../enhanced-codeblock/menus';
import { EMPTY_ARRAY } from '../../../lib/client/constant';
import { useSetPageGlobalVariable } from '@/contexts/page-global-variable';

interface GlobalMenuProps {
  menus?: Menu[],
  children: React.ReactNode
}

function createInitialState(menus: Menu[]): MenuValue {
  return menus.reduce<MenuValue>((acc, menu) => {
    const value = menu.items[0][1];
    acc = { ...acc, ...value };
    return acc;
  }, {});
}

function GlobalMenu({
  menus = EMPTY_ARRAY
}: GlobalMenuProps) {
  const setPageGlobalVars = useSetPageGlobalVariable();
  const setVariableState = (value: MenuValue) => {
    setPageGlobalVars((prev) => ({
      ...prev,
      ...value
    }));
  };
  setVariableState(createInitialState(menus));
  return (
    <div>
      <CodeBlockMenu menus={menus} dispatch={setVariableState} />
    </div>
  );
}

export default memo(GlobalMenu);
