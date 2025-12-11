import MirrorZLogo from '@/components/mirrorz-logo';
import { memo } from 'react';
import { CurrentYear } from 'foxact/current-year';
import * as stylex from '@stylexjs/stylex';
import ExternalLink from '../../external-link';
import NextLink from 'next/link';
import { issueUrl, mirrorzUrl } from '@/lib/client/constant';

const styles = stylex.create({
  footer: {
    color: 'var(--text-secondary)',
    paddingTop: {
      default: '48px',
      '@media (min-width: 840px)': '64px'
    },
    paddingBottom: {
      default: '48px',
      '@media (min-width: 840px)': '64px'
    },
    paddingLeft: {
      default: '20px',
      '@media (min-width: 840px)': '48px'
    },
    paddingRight: {
      default: '20px',
      '@media (min-width: 840px)': '48px'
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
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 640px)': 'repeat(3, minmax(0, 1fr))',
      '@media (min-width: 1536px)': 'repeat(5, minmax(0, 1fr))'
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
    gridColumnStart: {
      default: 'span 2',
      '@media (min-width: 640px)': 'span 1'
    },
    gridColumnEnd: {
      default: 'span 2',
      '@media (min-width: 640px)': 'span 1'
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
    color: {
      default: 'var(--text-secondary)',
      ':hover': 'var(--text-link)'
    },
    transitionProperty: 'color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease'
  },
  footer_section_base: {
    display: 'flex',
    flexDirection: 'column'
  },
  social: {
    color: 'var(--text-primary)'
  }
});

function Header({ children }: React.PropsWithChildren) {
  return <div {...stylex.props(styles.footer_header)}>{children}</div>;
}

function FooterLink({ href, ...props }: Omit<React.JSX.IntrinsicElements['a'], 'ref'>) {
  if (!href) {
    return <div {...stylex.props(styles.footer_link)}>{props.children}</div>;
  }

  if (href.startsWith('https://')) {
    return (
      <div>
        <ExternalLink href={href} {...stylex.props(styles.footer_link)} {...props} />
      </div>
    );
  }

  return (
    <div>
      <NextLink href={href} {...stylex.props(styles.footer_link)} {...props} />
    </div>
  );
}

// TODO: finish footer
function Footer() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.footer_main)}>
          <div {...stylex.props(styles.logo_section)}>
            <ExternalLink href={`https://${mirrorzUrl}/`}>
              <MirrorZLogo {...stylex.props(styles.mirrorz_logo)} />
              <p {...stylex.props(styles.logo_text)}>MirrorZ Project</p>
            </ExternalLink>
          </div>
          <div {...stylex.props(styles.copyright)}>
            &copy; <CurrentYear defaultYear={2024} />
          </div>
        </div>
        <div {...stylex.props(styles.footer_section_base)}>
          {/** TODO: Contributing Guide */}
          <Header>Contributing</Header>
          <FooterLink href="#">
            Code of Conduct (WIP)
          </FooterLink>
          <FooterLink href={issueUrl}>
            Report an Issue
          </FooterLink>
          <FooterLink href="#">
            Contributing Guide (WIP)
          </FooterLink>
        </div>
        <div {...stylex.props(styles.footer_section_base)}>
          <Header>More</Header>
          <FooterLink href={`https://${mirrorzUrl}/`}>
            MirrorZ Homepage
          </FooterLink>
          <FooterLink href="https://github.com/mirrorz-org">
            GitHub
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
