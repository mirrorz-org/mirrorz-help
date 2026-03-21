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
  state: MenuValue,
  dispatch: React.Dispatch<MenuValue>
}

function CodeBlockMenu({ menus, state, dispatch }: CodeBlockMenuProps) {
  const chosenValues = menus.map((entry) => (
    'items' in entry
      ? 0 as number
      : ('trueValue' in entry
        ? (state[entry.name] === entry.trueValue)
        : state[entry.name] || entry.defaultValue || '')
  ));

  const handleChange: React.ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    const menuIndex = Number.parseInt(name, 10);
    const menu = menus[menuIndex];
    let itemValue: number | string;
    if ('items' in menu) {
      itemValue = Number.parseInt(value, 10);
    } else {
      itemValue = value;
    }
    chosenValues[menuIndex] = itemValue;
    const newValue = Object.values(chosenValues).reduce<MenuValue>((acc, chosen, menuIndex) => {
      const menu = menus[menuIndex];
      let value: MenuValue;
      if ('items' in menu) {
        value = menu.items[chosen as number][1];
      } else if ('trueValue' in menu) {
        const boolVal = chosen as boolean;
        value = { [menu.name]: boolVal ? menu.trueValue : menu.falseValue };
      } else {
        value = { [menu.name]: chosen as string };
      }
      return {
        ...acc,
        ...value
      };
    }, {});
    dispatch(newValue);
  };

  const handleSwitchChange = (menu: BooleanInput) => () => {
    const currentValue = state[menu.name] === menu.trueValue;
    const newBoolValue = !currentValue;

    const newValue = { ...state };
    newValue[menu.name] = newBoolValue ? menu.trueValue : menu.falseValue;

    dispatch(newValue);
  };

  return (
    <div {...stylex.props(styles.container)}>
      {menus.map((menu, menuIndex) => (
        <div {...stylex.props(styles.menu)} key={menu.title}>
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
                  checked={state[menu.name] === menu.trueValue}
                  onChange={handleSwitchChange(menu)}
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
