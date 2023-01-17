import { useRef, useEffect } from 'react';
import Link from 'next/link';
import style9 from 'style9';

interface SidebarLinkProps {
  href: string;
  isActive?: boolean;
  title: string;
  isPending: boolean;
}

const styles = style9.create({
  base: {
    paddingTop: '8px',
    paddingBottom: '8px',
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
    '@media screen and (min-width: 840px)': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px'
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

export function SidebarLink({
  href,
  isActive = false,
  title,
  isPending
}: SidebarLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isActive && ref && ref.current) {
      if ('scrollIntoViewIfNeeded' in ref.current && typeof ref.current.scrollIntoViewIfNeeded === 'function') {
        ref.current.scrollIntoViewIfNeeded();
      }
    }
  }, [ref, isActive]);

  return (
    <Link
      href={href}
      ref={ref}
      title={title}
      target={href.startsWith('https://') ? '_blank' : ''}
      className={styles('base', isActive ? 'active' : 'inactive', isPending && 'pending')}
    >
      {title}
    </Link>
  );
}
