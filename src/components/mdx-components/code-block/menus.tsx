import { useMemo } from 'react';
import style9 from 'style9';

export interface Menu {
  title: string;
  variableName: string,
  items: [displayName: string, value: string][];
}

const styles = style9.create({
  selectWrapper: {
    display: 'flex',
    flexWrap: 'nowrap'
  }
});

interface CodeBlockMenuProps {
  menus?: Menu[];
  isHttpProtocol: boolean
}

const enableHttpMenu: Menu = {
  title: '是否启用 HTTPS',
  variableName: 'httpProtocol',
  items: [
    ['HTTPS', 'https://'],
    ['HTTP', 'http://']
  ]
};

export default function CodeBlockMenu({ menus, isHttpProtocol = true }: CodeBlockMenuProps) {
  const finalMenus = useMemo(() => {
    if (isHttpProtocol) {
      if (menus) return [...menus, enableHttpMenu];
      return [enableHttpMenu];
    }
    return menus || [];
  }, [isHttpProtocol, menus]);

  return (
    <div className={styles('selectWrapper')}>
      {finalMenus.map(menu => {
        return (
          <div key={menu.variableName}>
            <span>{menu.title}</span>
            <select>
              {menu.items.map(item => (
                <option key={item[1]} value={item[1]}>{item[0]}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
