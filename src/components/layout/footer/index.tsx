import MirrorZLogo from '@/components/mirrorz-logo';
import React, { memo, useEffect, useState } from 'react';
import style9 from 'style9';
import ExternalLink from '../../external-link';
import NextLink from 'next/link';

const styles = style9.create({
  footer: {
    color: 'var(--text-secondary)',
    paddingTop: '48px',
    paddingBottom: '48px',
    paddingLeft: '20px',
    paddingRight: '20px',
    '@media screen and (min-width: 840px)': {
      paddingLeft: '48px',
      paddingRight: '48px',
      paddingTop: '64px',
      paddingBottom: '64px'
    }
  },
  copyright: {
    fontSize: 14,
    marginTop: '16px'
  },
  inner: {
    display: 'grid',
    columnGap: '48px',
    rowGap: '32px',
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    '@media screen and (min-width: 640px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
    },
    '@media screen and (min-width: 1536px)': {
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))'
    }
  },
  mirrorz_logo: {
    width: '64px',
    height: '64px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '8px'
  },
  logo_section: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo_text: {
    fontWeight: 700,
    fontSize: 16
  },
  footer_main: {
    justifyItems: 'start',
    width: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'left',
    gridColumnStart: 'span 2',
    gridColumnEnd: 'span 2',
    '@media screen and (min-width: 640px)': {
      gridColumnStart: 'span 1',
      gridColumnEnd: 'span 1'
    }
  },
  footer_header: {
    color: 'var(--text-primary)',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: '8px'
  },
  footer_link: {
    fontSize: 14,
    lineHeight: '30px',
    color: 'var(--text-secondary)',
    transitionProperty: 'color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',
    ':hover': {
      color: 'var(--text-link)'
    }
  },
  footer_section_base: {
    display: 'flex',
    flexDirection: 'column'
  },
  social: {
    color: 'var(--text-primary)'
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

const Header = ({ children }: React.PropsWithChildren<unknown>) => (
  <div className={styles('footer_header')}>{children}</div>
);

const FooterLink = ({ href, ...props }: Omit<JSX.IntrinsicElements['a'], 'ref'>) => {
  if (!href) {
    return <div className={styles('footer_link')}>{props.children}</div>;
  }

  if (href.startsWith('https://')) {
    return (
      <div>
        <ExternalLink href={href} className={styles('footer_link')} {...props} />
      </div>
    );
  }

  return (
    <div>
      <NextLink href={href} className={styles('footer_link')} {...props} />
    </div>
  );
};

// TODO: finish footer
function Footer() {
  return (
    <footer className={styles('footer')}>
      <div className={styles('inner')}>
        <div className={styles('footer_main')}>
          <div className={styles('logo_section')}>
            <ExternalLink href="https://mirrorz.org/">
              <MirrorZLogo className={styles('mirrorz_logo')} />
              <p className={styles('logo_text')}>MirrorZ Project</p>
            </ExternalLink>
          </div>
          <div className={styles('copyright')}>
            &copy; <CurrentYear />
          </div>
        </div>
        <div className={styles('footer_section_base')}>
          {/** TODO: GitHub Issue URL builder + Contributing Guide */}
          <Header>Contributing</Header>
          <FooterLink href="#">
            Code of Conduct (WIP)
          </FooterLink>
          <FooterLink href="#">
            Report an Issue
          </FooterLink>
          <FooterLink href="#">
            Contributing Guide (WIP)
          </FooterLink>
        </div>
        <div className={styles('footer_section_base')}>
          <Header>More</Header>
          <FooterLink href="https://mirrorz.org/">
            MirrorZ Homepage
          </FooterLink>
          <FooterLink href="https://github.com/mirrorz/">
            GitHub
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
