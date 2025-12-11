import { Command } from 'cmdk';
import { memo, startTransition, useCallback } from 'react';
import { useSearchOpen, useSetSearchOpen } from '@/contexts/search';
import * as stylex from '@stylexjs/stylex';

import routesJson from '@/routes.json';

// import cmdkStyles from './cmdk.module.sass';
// import { clsx } from 'clsx';
import { useRouter } from 'next/router';

const data = Object.entries(routesJson);

const styles = stylex.create({
  root: {
    maxWidth: '640px',
    width: '100%',
    overflow: 'hidden',
    padding: 0
  },
  input: {
    borderStyle: 'none',
    width: '100%',
    fontSize: '18px',
    padding: '20px',
    outline: 'none',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border-secondary)',
    borderRadius: '0',
    margin: '0',
    '::placeholder': {
      color: 'var(--text-shallow)'
    }
  },
  item: {
    contentVisibility: 'auto',
    cursor: 'pointer',
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    paddingBlock: '14px',
    paddingInline: '20px',
    color: 'var(--text-primary)',
    userSelect: 'none',
    willChange: 'background-color, color',
    transitionProperty: 'none',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
    position: 'relative',
    gap: '12px'
  },
  list: {
    height: {
      '@media (min-width: 640px)': 'var(--cmdk-list-height)'
    },
    maxHeight: {
      default: '400px',
      '@media (min-width: 640px)': '650px'
    },
    overflow: 'auto',
    overscrollBehaviorX: 'contain',
    overscrollBehaviorY: 'contain',
    transitionDuration: '100ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'height'
  },
  empty: {
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '64px',
    whiteSpace: 'pre-wrap',
    color: 'var(--text-secondary)'
  }
});

// TODO: We can replace it with full-text search in the future
function SearchCommandK() {
  const open = useSearchOpen();
  const setOpen = useSetSearchOpen();

  const router = useRouter();
  const handleSelect = useCallback((pathname: string) => {
    if (pathname) {
      startTransition(() => {
        router.push({
          pathname,
          query: router.query.mirror ? { mirror: router.query.mirror || null } : undefined
        });
        setOpen(false);
      });
    }
  }, [router, setOpen]);

  return (
    <Command.Dialog
      {...stylex.props(styles.root)}
      open={open}
      onOpenChange={setOpen}
    >
      <Command.Input
        {...stylex.props(styles.input)}
        placeholder="Search documentation"
        autoFocus
      />

      <Command.List {...stylex.props(styles.list)}>
        {/* {isLoading && <Command.Loading>Hang on…</Command.Loading>} */}

        <Command.Empty {...stylex.props(styles.empty)}>No results found.</Command.Empty>
        {
          data.map(([href, route]) => (
            <Command.Item
              value={href}
              key={href}
              {...stylex.props(styles.item)}
              onSelect={handleSelect}
            >
              {route.title}
            </Command.Item>
          ))
        }
      </Command.List>
    </Command.Dialog>
  );
}

export default memo(SearchCommandK);
