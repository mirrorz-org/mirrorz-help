import * as stylex from '@stylexjs/stylex';
import IconChevronUpDown from '../../icons/chevron-up-down';
import { memo } from 'react';

export type MenuValue = Record<string, string | boolean>;

export interface InputCommon {
  title: string,
  note?: string
}

export interface Menu extends InputCommon {
  items: Array<[displayName: string, value: MenuValue]>
}

export interface TextInput extends InputCommon {
  name: string,
  defaultValue?: string
}

export type InputType = Menu | TextInput;

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
  input_text_wrapper: {
    display: 'flex',
    color: 'var(--text-primary)',
    marginLeft: '12px',
    position: 'relative',
    alignItems: 'center'
  },
  input_text: {
    display: 'inline-flex',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
    paddingLeft: '8px',
    marginLeft: '0'
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
  menus: InputType[],
  dispatch: React.Dispatch<MenuValue>
}

function CodeBlockMenu({ menus, dispatch }: CodeBlockMenuProps) {
  const chosenValues = menus.map((entry) => ('items' in entry ? 0 as number : entry.defaultValue || ''));

  const handleChange: React.ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    const menuIndex = Number.parseInt(name, 10);
    const itemValue = 'items' in menus[menuIndex] ? Number.parseInt(value, 10) : value;
    chosenValues[menuIndex] = itemValue;
    const newValue = Object.values(chosenValues).reduce<MenuValue>((acc, chosen, menuIndex) => {
      const value = 'items' in menus[menuIndex] ? menus[menuIndex].items[chosen as number][1] : { [menus[menuIndex].name]: chosen as string };
      return {
        ...acc,
        ...value
      };
    }, {});
    dispatch(newValue);
  };

  return (
    <div {...stylex.props(styles.container)}>
      {menus.map((menu, menuIndex) => (
        <div {...stylex.props(styles.menu)} key={menu.title}>
          <span>{menu.title}</span>
          {'items' in menu
            ? <div {...stylex.props(styles.select_wrapper)}>
              <select {...stylex.props(styles.select)} onChange={handleChange} name={menuIndex.toString()} defaultValue="0">
                {menu.items.map((item, optionIndex) => {
                  const value = optionIndex.toString();
                  const key = `${menu.title}_${value}`;
                  return <option key={key} value={value}>{item[0]}</option>;
                })}
              </select>
              <span {...stylex.props(styles.icon_wrapper)}>
                <IconChevronUpDown {...stylex.props(styles.icon)} />
              </span>
            </div>
            : <div {...stylex.props(styles.input_text_wrapper)}>
              <input
                {...stylex.props(styles.input_text)}
                type="text"
                onChange={handleChange}
                name={menuIndex.toString()}
                defaultValue={menu.defaultValue}
              />
            </div>}
        </div>
      ))}
    </div>
  );
}

export default memo(CodeBlockMenu);
