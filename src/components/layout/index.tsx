import style9 from 'style9';
import Nav from './nav';
import { useRouter } from 'next/router';
import DocumentationWrapper from './documentation-wrapper';
import type { ToC } from '@/lib/server/parse-markdown';
import ToCList from './toc';

const styles = style9.create({
  container: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    '@media screen and (min-width: 840px)': {
      gridTemplateColumns: '320px auto'
    },
    '@media screen and (min-width: 1280px)': {
      gridTemplateColumns: '320px auto 320px'
    }
  },
  sidenav_container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 50,
    boxShadow: 'var(--nav-shadow)',
    '@media screen and (min-width: 840px)': {
      position: 'sticky',
      boxShadow: 'none'
    }
  },
  main: {
    minWidth: 0
  },
  main_spacer: {
    height: '64px',
    marginBottom: '8px',
    '@media screen and (min-width: 840px)': {
      display: 'none'
    }
  },
  toc: {
    display: 'none',
    '@media screen and (min-width: 840px)': {
      maxWidth: '336px'
    },
    '@media screen and (min-width: 1280px)': {
      display: 'block'
    }
  },
  article: {
    overflowWrap: 'break-word'
  }
});

interface LayoutProps {
  toc?: ToC[]
}

export function Layout({ children, toc = [] }: React.PropsWithChildren<LayoutProps>) {
  const { asPath } = useRouter();

  return (
    <div className={styles('container')}>
      <div className={styles('sidenav_container')}>
        <Nav />
      </div>
      <main className={styles('main')}>
        <div className={styles('main_spacer')} />
        <article className={styles('article')} key={asPath}>
          <DocumentationWrapper>
            {children}
          </DocumentationWrapper>
        </article>
      </main>
      <div className={styles('toc')}>
        {toc.length > 0 && (
          <ToCList key={asPath} toc={toc} />
        )}
      </div>
    </div>
  );
}
