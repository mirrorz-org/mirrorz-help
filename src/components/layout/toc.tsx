import type { ToC } from '@/lib/server/parse-markdown';
import * as stylex from '@stylexjs/stylex';
import { useTocHighlight } from '../../hooks/use-toc-highlight';
import IconToC from '../icons/toc';
import { memo } from 'react';

const styles = stylex.create({
  toc: {
    paddingTop: '22px',
    position: 'sticky',
    top: 0,
    right: 0
  },
  header: {
    display: 'flex',
    width: '100%',
    flexWrap: 'nowrap',
    marginBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  header_icon: {
    width: '20px',
    height: '20px',
    marginRight: '8px'
  },
  header_title: {
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--text-secondary)'
  },
  inner: {
    height: '100%',
    overflowY: 'auto',
    paddingLeft: '16px',
    maxHeight: 'calc(100vh - 120px)'
  },
  list: {
    paddingBottom: '64px'
  },
  item: {
    marginTop: '8px',
    fontSize: 14,
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px'
  },
  item_deep: {
    paddingLeft: '20px'
  },
  item_active: {
    backgroundColor: 'var(--bg-highlight)'
  },
  item_link: {
    lineHeight: 1.5,
    paddingTop: '8px',
    paddingBottom: '8px',
    color: {
      ':hover': 'var(--text-link)'
    }
  },
  item_link_active: {
    color: 'var(--text-link)',
    fontWeight: 700
  },
  item_link_inactive: {
    color: 'var(--text-secondary)'
  }
});

interface ToCProps {
  toc: ToC[]
}

function ToCAside({ toc }: ToCProps) {
  const currentIndex = useTocHighlight();
  // Prevent ToC overflow
  const selectedIndex = currentIndex > toc.length - 1 ? toc.length - 1 : currentIndex;

  return (
    <nav role="navigation" {...stylex.props(styles.toc)}>
      {toc.length > 0 && (
        <div {...stylex.props(styles.header)}>
          <IconToC {...stylex.props(styles.header_icon)} />
          <p {...stylex.props(styles.header_title)}>
            On this page
          </p>
        </div>
      )}
      <div {...stylex.props(styles.inner)}>
        <ul {...stylex.props(styles.list)}>
          {toc.length > 0
            && toc.map((h, i) => {
              if (process.env.NODE_ENV !== 'production' && typeof h.url !== 'string') {
              // eslint-disable-next-line no-console -- only log in DEV
                console.error('Heading does not have URL');
              }
              if (h.depth < 2 && h.depth > 3) return null;
              return (
                <li
                  key={`heading-${h.url}-${h.text}`}
                  {...stylex.props(
                    styles.item,
                    h.depth === 3 && styles.item_deep,
                    selectedIndex === i && styles.item_active
                  )}
                >
                  <a
                    {...stylex.props(styles.item_link, selectedIndex === i ? styles.item_link_active : styles.item_link_inactive)}
                    href={h.url}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    </nav>
  );
}

export default memo(ToCAside);
