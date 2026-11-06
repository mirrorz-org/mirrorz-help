import * as stylex from '@stylexjs/stylex';
import IconChevronUpDown from '../../icons/chevron-up-down';
import { memo } from 'react';
import Switch from '../../form/checkbox';

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

export interface BooleanInput extends InputCommon {
  name: string,
  defaultValue: boolean,
  trueValue: string | boolean,
  falseValue: string | boolean
}

export type InputType = Menu | TextInput | BooleanInput;

const controlBase = {
  display: 'inline-flex',
  paddingLeft: '8px',
  fontSize: '14px',
  height: '32px',
  lineHeight: 1.5,
  borderRadius: '8px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  backgroundColor: 'var(--bg-wash)',
  color: 'var(--text-primary)'
} as const;

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
  input_wrapper: {
    position: 'relative',
    marginLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)'
  },
  input_text: {
    ...controlBase,
    paddingRight: '8px',
    minWidth: '140px',
    marginLeft: '0',
    marginRight: '0',
    marginBottom: '0',
    outline: {
      default: 'none',
      ':focus': 'none'
    },
    '::placeholder': {
      color: 'var(--text-shallow)'
    }
  },
  select: {
    ...controlBase,
    paddingRight: '22px',
    cursor: 'pointer',
    appearance: 'none'
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
  variableState: MenuValue,
  dispatch: React.Dispatch<React.SetStateAction<MenuValue>>
}

function CodeBlockMenu({ menus, variableState, dispatch }: CodeBlockMenuProps) {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    const menuIndex = Number.parseInt(name, 10);
    const menu = menus[menuIndex];

    let partial: MenuValue;
    if ('items' in menu) {
      partial = menu.items[Number.parseInt(value, 10)][1];
    } else {
      partial = { [menu.name]: value };
    }
    dispatch(prev => ({ ...prev, ...partial }));
  };

  const handleSwitchChange = (menuIndex: number) => () => {
    const menu = menus[menuIndex] as BooleanInput;
    dispatch(prev => ({
      ...prev,
      [menu.name]: prev[menu.name] === menu.trueValue ? menu.falseValue : menu.trueValue
    }));
  };

  return (
    <div {...stylex.props(styles.container)}>
      {menus.map((menu, menuIndex) => (
        <div key={menu.title} {...stylex.props(styles.menu)}>
          {'items' in menu
            ? <>
              <span>{menu.title}</span>
              <div {...stylex.props(styles.input_wrapper)}>
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
            </>
            : ('trueValue' in menu
              ? (
                <Switch
                  checked={variableState[menu.name] === menu.trueValue}
                  onChange={handleSwitchChange(menuIndex)}
                  label={menu.title}
                />
              )
              : <>
                <span>{menu.title}</span>
                <div {...stylex.props(styles.input_wrapper)}>
                  <input
                    {...stylex.props(styles.input_text)}
                    type="text"
                    onChange={handleChange}
                    name={menuIndex.toString()}
                    defaultValue={menu.defaultValue}
                  />
                </div>
              </>)}
        </div>
      ))}
    </div>
  );
}

export default memo(CodeBlockMenu);
