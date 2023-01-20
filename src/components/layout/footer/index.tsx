import MirrorZLogo from '@/components/mirrorz-logo';
import { memo, useEffect, useState } from 'react';
import style9 from 'style9';

const styles = style9.create({
  outer: {
    paddingTop: '48px',
    marginTop: '48px',
    paddingBottom: '48px',
    paddingLeft: '20px',
    paddingRight: '20px',
    borderTop: '1px solid var(--border)',
    '@media screen and (min-width: 640px)': {
      paddingLeft: '48px',
      paddingRight: '48px'
    },
    '@media screen and (min-width: 840px)': {
      paddingTop: '64px',
      paddingBottom: '64px'
    }
  },
  wrapper: {
    maxWidth: '1280px',
    margin: 'auto'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
    gap: '24px',
    '@media screen and (min-width: 840px)': {
      // @ts-expect-error -- missing in csstypes
      gap: '0px'
    }
  },
  main_wrapper: {
    gridColumnStart: 'span 8',
    gridColumnEnd: 'span 8',
    '@media screen and (min-width: 840px)': {
      gridColumnStart: 'span 2',
      gridColumnEnd: 'span 2'
    }
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // @ts-expect-error -- missing in csstypes
    gap: '24px',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '12px',
    paddingRight: '12px',
    '@media screen and (min-width: 840px)': {
      display: 'block',
      paddingTop: 0,
      paddingBottom: 0
    }
  },
  logo: {
    width: '64px',
    height: '64px',
    margin: 'auto'
  },
  logo_text: {
    marginTop: '12px',
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: '0.02em',
    fontWeight: 700
  },
  content_wrapper: {
    gridColumnStart: 'span 8',
    gridColumnEnd: 'span 8',
    '@media screen and (min-width: 840px)': {
      gridColumnStart: 'span 6',
      gridColumnEnd: 'span 6'
    }
  },
  copyright: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '16px',
    paddingBottom: '32px',
    '@media screen and (min-width: 840px)': {
      paddingLeft: '64px'
    }
  }
});

const CurrentYear = () => {
  const [year, setYear] = useState(2023);
  useEffect(() => {
    // eslint-disable-next-line @fluffyfox/no-unsafe-date -- safe
    setYear(new Date().getFullYear());
  }, []);
  return <span>{year}</span>;
};

function Footer() {
  return (
    <footer className={styles('outer')}>
      <div className={styles('wrapper')}>
        <div className={styles('container')}>
          <div className={styles('main_wrapper')}>
            <div className={styles('main')}>
              <MirrorZLogo className={styles('logo')} />
              <p className={styles('logo_text')}>MirrorZ Project</p>
            </div>
          </div>
          <div className={styles('content_wrapper')}>
            {/* <div className="grid grid-cols-2 gap-6 pb-16 sm:grid-cols-3 md:pl-16" /> */}
            <div className={styles('copyright')}>
              <span>&copy; MirrorZ <CurrentYear /></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
