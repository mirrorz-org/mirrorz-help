import style9 from 'style9';
import IconChevronUpDown from '../../icons/chevron-up-down';
import { memo, useCallback, useMemo } from 'react';

export type MenuValue = Record<string, string>;
export interface Menu {
  title: string,
  items: Array<[displayName: string, value: MenuValue]>
}

const styles = style9.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginRight: '20px',
    marginBottom: '8px',
    ':last-child': {
      marginRight: 0
    }
  },
  select_wrapper: {
    position: 'relative',
    marginLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)'
  },
  select: {
    display: 'inline-flex',
    paddingLeft: '8px',
    paddingRight: '22px',
    fontSize: '14px',
    height: '32px',
    cursor: 'pointer',
    appearance: 'none',
    lineHeight: 1.5,
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)'
  },
  icon_wrapper: {
    display: 'inline-flex',
    position: 'absolute',
    pointerEvents: 'none',
    color: 'var(--text-primary)',
    right: '4px'
  },
  icon: {
    width: '14px',
    height: '14px',
    '@media screen and (min-width: 840px)': {
      width: '16px',
      height: '16px'
    }
  }
});

interface CodeBlockMenuProps {
  menus: Menu[],
  dispatch: React.Dispatch<MenuValue>
}

function CodeBlockMenu({ menus, dispatch }: CodeBlockMenuProps) {
  const valueMap = useMemo(() => {
    const map: Record<string, MenuValue> = {};
    menus.forEach((menu, menuIndex) => {
      menu.items.forEach((item, itemIndex) => {
        map[`${menuIndex}_${itemIndex}`] = item[1];
      });
    });
    return map;
  }, [menus]);

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const { value } = e.currentTarget;
    dispatch(valueMap[value]);
  }, [dispatch, valueMap]);

  return (
    <div className={styles('container')}>
      {menus.map((menu, menuIndex) => (
        <div className={styles('menu')} key={menu.title}>
          <span>{menu.title}</span>
          <div className={styles('select_wrapper')}>
            <select className={styles('select')} onChange={handleChange}>
              {menu.items.map((item, optionIndex) => {
                const value = `${menuIndex}_${optionIndex}`;
                const key = `${menu.title}_${value}`;
                return <option key={key} value={value}>{item[0]}</option>;
              })}
            </select>
            <span className={styles('icon_wrapper')}>
              <IconChevronUpDown className={styles('icon')} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(CodeBlockMenu);
