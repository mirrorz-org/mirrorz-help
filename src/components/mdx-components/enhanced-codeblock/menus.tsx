import * as stylex from '@stylexjs/stylex';
import IconChevronUpDown from '../../icons/chevron-up-down';
import { memo, useCallback, useMemo } from 'react';

export type MenuValue = Record<string, string>;
export interface Menu {
  title: string,
  items: Array<[displayName: string, value: MenuValue]>
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginRight: {
      default: '20px',
      ':last-child': 0
    },
    marginBottom: '8px'
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
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
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
    width: {
      default: '14px',
      '@media (min-width: 840px)': '16px'
    },
    height: {
      default: '14px',
      '@media (min-width: 840px)': '16px'
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
    <div {...stylex.props(styles.container)}>
      {menus.map((menu, menuIndex) => (
        <div {...stylex.props(styles.menu)} key={menu.title}>
          <span>{menu.title}</span>
          <div {...stylex.props(styles.select_wrapper)}>
            <select {...stylex.props(styles.select)} onChange={handleChange}>
              {menu.items.map((item, optionIndex) => {
                const value = `${menuIndex}_${optionIndex}`;
                const key = `${menu.title}_${value}`;
                return <option key={key} value={value}>{item[0]}</option>;
              })}
            </select>
            <span {...stylex.props(styles.icon_wrapper)}>
              <IconChevronUpDown {...stylex.props(styles.icon)} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(CodeBlockMenu);
