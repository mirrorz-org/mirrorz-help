import { memo, useCallback } from 'react';
import Link from 'next/link';
import style9 from 'style9';

interface SidebarLinkProps {
  href: string,
  isActive?: boolean,
  title: string,
  isPending: boolean
}

const styles = style9.create({
  base: {
    paddingTop: '8px',
    paddingBottom: '8px',
    marginTop: '4px',
    paddingLeft: '20px',
    paddingRight: '8px',
    width: '100%',
    fontSize: 14,
    lineHeight: 2,
    fontWeight: 500,
    borderRadius: '0px',
    textAlign: 'left',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    '@media screen and (min-width: 840px)': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    },
    ':hover': {
      backgroundColor: 'var(--bg-hover)'
    }
  },
  active: {
    fontWeight: 700,
    color: 'var(--text-link)',
    backgroundColor: 'var(--bg-highlight)',
    ':hover': {
      backgroundColor: 'var(--bg-highlight)',
      color: 'var(--text-link)'
    }
  },
  inactive: {
    color: 'var(--text-primary)'
  },
  pending: {
    backgroundColor: 'var(--bg-hover)',
    ':hover': {
      backgroundColor: 'var(--bg-hover)'
    }
  }
});

function SidebarLink({
  href,
  isActive = false,
  title,
  isPending
}: SidebarLinkProps) {
  return (
    <Link
      // Disable prefetch when in view (prevent unnecessary requests)
      prefetch={false}
      href={href}
      ref={useCallback((el: HTMLAnchorElement | null) => {
        if (el && isActive && 'scrollIntoViewIfNeeded' in el && typeof el.scrollIntoViewIfNeeded === 'function') {
          el.scrollIntoViewIfNeeded();
        }
      }, [isActive])}
      title={title}
      target={href.startsWith('https://') ? '_blank' : undefined}
      className={styles('base', isActive ? 'active' : 'inactive', isPending && 'pending')}
    >
      {title}
    </Link>
  );
}

export default memo(SidebarLink);
