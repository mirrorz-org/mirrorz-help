import type { ToC } from '@/lib/server/parse-markdown';
import style9 from 'style9';

const styles = style9.create({
  header: {
    paddingTop: '22px',
    position: 'sticky',
    top: 0,
    right: 0
  },
  header_title: {
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--text-secondary)',
    paddingLeft: '16px',
    paddingRight: '16px',
    width: '100%'
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
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px'
  },
  item_deep: {
    paddingLeft: '16px'
  },
  item_link: {
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    paddingTop: '8px',
    paddingBottom: '8px',
    ':hover': {
      color: 'var(--text-link)'
    }
  }
});

interface ToCProps {
  toc: ToC[]
}

export default function ToCList({ toc }: ToCProps) {
  return (
    <nav role="navigation" className={styles('header')}>
      {toc.length > 0 && (
        <h2 className={styles('header_title')}>
          On this page
        </h2>
      )}
      <div className={styles('inner')}>
        <ul className={styles('list')}>
          {toc.length > 0
            && toc.map((h, i) => {
              if (process.env.NODE_ENV !== 'production') {
                if (h.url == null) {
                  // eslint-disable-next-line no-console -- only log in DEV
                  console.error('Heading does not have URL');
                }
              }
              if (h.depth < 2 && h.depth > 3) return null;
              return (
                <li key={`heading-${h.url}-${i}`} className={styles('item', h.depth === 3 && 'item_deep')}>
                  <a className={styles('item_link')} href={h.url}>
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
