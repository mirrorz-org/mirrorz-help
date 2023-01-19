import style9 from 'style9';
import IconChevronUpDown from '../../icons/chevron-up-down';
import { useCallback } from 'react';

export interface Menu {
  title: string;
  variableName: string,
  items: [displayName: string, value: string][];
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
  menus: Menu[];
  dispatch: React.Dispatch<[string, string]>;
}

export default function CodeBlockMenu({ menus, dispatch }: CodeBlockMenuProps) {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const { name, value } = e.target;
    dispatch([name, value]);
  }, [dispatch]);

  return (
    <div className={styles('container')}>
      {menus.map(menu => {
        return (
          <div className={styles('menu')} key={menu.variableName}>
            <span>{menu.title}</span>
            <div className={styles('select_wrapper')}>
              <select name={menu.variableName} className={styles('select')} onChange={handleChange}>
                {menu.items.map(item => (
                  <option key={item[1]} value={item[1]}>{item[0]}</option>
                ))}
              </select>
              <span className={styles('icon_wrapper')}>
                <IconChevronUpDown className={styles('icon')} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
