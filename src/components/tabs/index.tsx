import {
  Root as TabsRoot,
  List as TabsList,
  Trigger as TabsTrigger,
  Content as TabsContent
} from '@radix-ui/react-tabs';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';

import type { WithXStyleProps } from '@/types/stylex';

interface TabsProps {
  items: string[],
  defaultValue?: string
}

const styles = stylex.create({
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
    overscrollBehaviorX: 'contain'
  },
  list: {
    display: 'flex',
    width: 'max-content',
    minWidth: '100%',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border-secondary)',
    paddingBottom: '8px'
  },
  trigger: {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    paddingBlock: '8px',
    paddingInline: '12px',
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
    borderBottomColor: {
      default: 'transparent',
      ':hover': 'var(--border)'
    },
    color: {
      default: 'var(--text-secondary)',
      ':hover': 'var(--text-primary)'
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
    <TabsRoot {...stylex.props(styles.root)} value={value} onValueChange={setValue}>
      <TabsList {...stylex.props(styles.list)}>
        {
          items.map(item => (
            <TabsTrigger
              key={item}
              {...stylex.props(styles.trigger, value === item && styles.trigger_active, value !== item && styles.trigger_inactive)}
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
  xstyle
}: WithXStyleProps<React.PropsWithChildren<{ value: string }>>) {
  return (
    <TabsContent {...stylex.props(styles.tab, xstyle)} value={value}>
      {children}
    </TabsContent>
  );
}
