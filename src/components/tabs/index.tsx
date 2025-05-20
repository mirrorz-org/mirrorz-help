import {
  Root as TabsRoot,
  List as TabsList,
  Trigger as TabsTrigger,
  Content as TabsContent
} from '@radix-ui/react-tabs';
import { useState } from 'react';
import style9 from 'style9';

import type { StyleWithAtRulesAndFalsy } from '@/types/style9';
import { EMPTY_ARRAY } from '../../lib/client/constant';

interface TabsProps {
  items: string[],
  defaultValue?: string
}

const styles = style9.create({
  root: {
    marginTop: '24px',
    marginBottom: '36px',
    scrollbarWidth: 'none',
    overflowX: 'auto',
    overflowY: 'hidden',
    marginLeft: '-12px',
    marginRight: '-12px',
    paddingLeft: '12px',
    paddingRight: '12px',
    overscrollBehaviorX: 'contain',
    msOverflowStyle: 'none'
  },
  list: {
    display: 'flex',
    width: 'max-content',
    minWidth: '100%',
    borderBottom: '1px solid var(--border-secondary)',
    paddingBottom: '8px'
  },
  trigger: {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    padding: '8px 12px',
    fontWeight: 500,
    lineHeight: 1.25,
    fontSize: 18,
    transitionProperty: 'color, background-color, border-color, text-decoration-color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '-8px',
    userSelect: 'none',
    borderBottomWidth: '3px'
  },
  trigger_active: {
    borderBottomColor: 'var(--bg-primary)',
    color: 'var(--bg-primary)'
  },
  trigger_inactive: {
    borderBottomColor: 'transparent',
    color: 'var(--text-secondary)',
    ':hover': {
      color: 'var(--text-primary)',
      borderBottomColor: 'var(--border)'
    }
  },
  tab: {
    borderRadius: '8px',
    paddingTop: '24px'
  }
});

export function Tabs({ children, items, defaultValue }: React.PropsWithChildren<TabsProps>) {
  const [value, setValue] = useState(defaultValue || items[0]);
  return (
    <TabsRoot className={styles('root')} value={value} onValueChange={setValue}>
      <TabsList className={styles('list')}>
        {
          items.map(item => (
            <TabsTrigger
              key={item}
              className={styles({
                trigger: true,
                trigger_active: value === item,
                trigger_inactive: value !== item
              })}
              value={item}
            >
              {item}
            </TabsTrigger>
          ))
        }
      </TabsList>
      {children}
    </TabsRoot>
  );
}

export function TabItem({
  children,
  value,
  xstyle = EMPTY_ARRAY
}: React.PropsWithChildren<{ value: string, xstyle?: StyleWithAtRulesAndFalsy[] }>) {
  return (
    <TabsContent className={style9(styles.tab, ...xstyle)} value={value}>
      {children}
    </TabsContent>
  );
}
