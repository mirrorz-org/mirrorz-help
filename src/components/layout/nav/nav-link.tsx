import { memo, useCallback } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/router';

interface SidebarLinkProps {
  pathname: string,
  isActive?: boolean,
  title: string,
  isPending: boolean
}

const styles = stylex.create({
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
    borderTopRightRadius: {
      default: '8px',
      '@media (min-width: 840px)': '8px'
    },
    borderBottomRightRadius: {
      default: '8px',
      '@media (min-width: 840px)': '8px'
    },
    borderTopLeftRadius: {
      default: '8px',
      '@media (min-width: 840px)': 0
    },
    borderBottomLeftRadius: {
      default: '8px',
      '@media (min-width: 840px)': 0
    },
    backgroundColor: {
      ':hover': 'var(--bg-hover)'
    }
  },
  active: {
    fontWeight: 700,
    color: {
      default: 'var(--text-link)',
      ':hover': 'var(--text-link)'
    },
    backgroundColor: {
      default: 'var(--bg-highlight)',
      ':hover': 'var(--bg-highlight)'
    }
  },
  inactive: {
    color: 'var(--text-primary)'
  },
  pending: {
    backgroundColor: {
      default: 'var(--bg-hover)',
      ':hover': 'var(--bg-hover)'
    }
  }
});

/**
 * Navigate to other software
 */
function SidebarLink({
  pathname,
  isActive = false,
  title,
  isPending
}: SidebarLinkProps) {
  const router = useRouter();

  /**
   * We only handles relative link here. If external link is really needed, we need to implement proper target="_blank"
   */
  if (!pathname.startsWith('/')) {
    throw new TypeError('<SidebarLink /> pathname must start with "/"');
  }

  return (
    <Link
      // Disable prefetch when in view (prevent unnecessary requests)
      prefetch={false}
      href={{
        pathname,
        query: router.query.mirror ? { mirror: router.query.mirror || null } : undefined
      }}
      ref={useCallback((el: HTMLAnchorElement | null) => {
        if (el && isActive && 'scrollIntoViewIfNeeded' in el && typeof el.scrollIntoViewIfNeeded === 'function') {
          el.scrollIntoViewIfNeeded();
        }
      }, [isActive])}
      title={title}
      {...stylex.props(styles.base, isActive ? styles.active : styles.inactive, isPending && styles.pending)}
      // target={pathname.startsWith('https://') ? '_blank' : undefined}
    >
      {title}
    </Link>
  );
}

export default memo(SidebarLink);
