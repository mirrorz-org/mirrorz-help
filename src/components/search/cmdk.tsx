import { Command } from 'cmdk';
import { memo, startTransition, useCallback } from 'react';
import { useSearchOpen, useSetSearchOpen } from '@/contexts/search';
import style9 from 'style9';

import routesJson from '@/routes.json';

// import cmdkStyles from './cmdk.module.sass';
// import clsx from 'clsx';
import { useRouter } from 'next/router';

const data = Object.entries(routesJson);

const styles = style9.create({
  root: {
    maxWidth: '640px',
    width: '100%',
    overflow: 'hidden',
    padding: 0
  },
  input: {
    border: 'none',
    width: '100%',
    fontSize: '18px',
    padding: '20px',
    outline: 'none',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border-secondary)',
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
    padding: '14px 20px',
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
    '@media screen and (min-width: 640px)': {
      height: 'var(--cmdk-list-height)',
      maxHeight: '650px'
    },
    maxHeight: '400px',
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
  const handleSelect = useCallback((href: string) => {
    if (href) {
      startTransition(() => {
        router.push(href);
        setOpen(false);
      });
    }
  }, [router, setOpen]);

  return (
    <Command.Dialog
      className={styles('root')}
      open={open}
      onOpenChange={setOpen}
    >
      <Command.Input
        className={styles('input')}
        placeholder="Search documentation"
        autoFocus
      />

      <Command.List className={styles('list')}>
        {/* {isLoading && <Command.Loading>Hang on…</Command.Loading>} */}

        <Command.Empty className={styles('empty')}>No results found.</Command.Empty>
        {
          data.map(([href, route]) => (
            <Command.Item
              value={href}
              key={href}
              className={styles('item')}
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
