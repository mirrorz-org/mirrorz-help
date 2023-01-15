import style9 from 'style9';

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
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
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
  }
});

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className={styles('container')}>
      <div className={styles('sidenav_container')}>
        <nav>
          <p>Sidebar</p>
        </nav>
      </div>
      <main className={styles('main')}>
        <div className={styles('main_spacer')} />
        {children}
      </main>
      <div className={styles('toc')}>
        <p>ToC</p>
      </div>
    </div>
  );
}
