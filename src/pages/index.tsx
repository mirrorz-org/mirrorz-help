import * as stylex from '@stylexjs/stylex';
import { Layout } from '../components/layout';
import MirrorzLogo from '../components/mirrorz-logo';

import IconUbuntu from '@/components/icons/brands/ubuntu';
import IconDebian from '@/components/icons/brands/debian';
import IconFedora from '../components/icons/brands/fedora';
import IconOpenSUSE from '../components/icons/brands/opensuse';
import IconArchLinux from '../components/icons/brands/archlinux';
import IconGentoo from '../components/icons/brands/gentoo';
import IconPython from '../components/icons/brands/python';
import Link from 'next/link';
import SeoHead from '../components/seo/head';
import JsonLD from '../components/seo/json-ld';

const styles = stylex.create({
  main: {
    marginTop: {
      default: '32px',
      '@media (min-width: 840px)': '40px'
    },
    marginBottom: {
      default: '32px',
      '@media (min-width: 840px)': '40px'
    },
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 640px)': 'row'
    },
    flexGrow: 1,
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 640px)': 'center'
    },
    justifyContent: 'flex-start'
  },
  mirrorz_logo: {
    width: {
      default: '80px',
      '@media (min-width: 640px)': '112px'
    },
    height: {
      default: '80px',
      '@media (min-width: 640px)': '112px'
    },
    marginRight: '12px'
  },
  title_wrapper: {
    marginTop: '8px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: 48,
    marginRight: '16px',
    fontWeight: 700,
    lineHeight: 1.25,
    color: 'var(--text-primary)'
  },
  h2: {
    marginTop: '36px',
    marginBottom: '24px',
    fontSize: 24,
    lineHeight: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 600
  },
  badge: {
    display: 'inline-flex',
    alignSelf: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
    marginTop: '4px',
    backgroundColor: 'var(--bg-highlight)',
    width: 'auto',
    borderRadius: '4px',
    color: 'var(--text-link)',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.025em',
    whiteSpace: 'nowrap'
  },
  paragraph: {
    marginTop: '24px',
    marginBottom: '24px',
    fontWeight: 400,
    lineHeight: 1.5,
    color: 'var(--text-primary)',
    fontSize: 18
  },
  featured_docs: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 640px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1536px)': 'repeat(4, minmax(0, 1fr))'
    },
    columnGap: '24px',
    rowGap: '24px'
  },
  card: {
    paddingBlock: '24px',
    paddingInline: '32px',
    boxShadow: 'var(--shadow-main)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: {
      default: 'var(--bg-card)',
      ':hover': 'var(--bg-hover)'
    }
  },
  brand_icon: {
    width: '64px',
    height: '64px'
  },
  card_title: {
    marginTop: '24px',
    fontSize: 18,
    fontWeight: 700
  }
});

export default function HomePage() {
  return (
    <>
      <SeoHead />
      <Layout>
        <div {...stylex.props(styles.main)}>
          <MirrorzLogo {...stylex.props(styles.mirrorz_logo)} />
          <div {...stylex.props(styles.title_wrapper)}>
            <h1 {...stylex.props(styles.title)}>
              MirrorZ Help
            </h1>
            <div {...stylex.props(styles.badge)}>
              Alpha
            </div>
          </div>
        </div>
        <section>
          <p {...stylex.props(styles.paragraph)}>
            MirrorZ Help 致力于成为一个开源、开放、且持续更新的开源软件镜像的帮助文档整合站点，旨在帮助高校间推广开源软件的使用。
          </p>
          <h2 {...stylex.props(styles.h2)}>热门文档</h2>
          <div {...stylex.props(styles.featured_docs)}>
            <Link href="/ubuntu/" {...stylex.props(styles.card)}>
              <IconUbuntu {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                Ubuntu 软件仓库镜像使用帮助
              </h3>
            </Link>
            <Link href="/debian/" {...stylex.props(styles.card)}>
              <IconDebian {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                Debian 软件仓库镜像使用帮助
              </h3>
            </Link>
            <Link href="/archlinux/" {...stylex.props(styles.card)}>
              <IconArchLinux {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                Arch Linux 软件仓库镜像使用帮助
              </h3>
            </Link>
            <Link href="/fedora/" {...stylex.props(styles.card)}>
              <IconFedora {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                Fedora 软件仓库镜像使用帮助
              </h3>
            </Link>
            <Link href="/opensuse/" {...stylex.props(styles.card)}>
              <IconOpenSUSE {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                openSUSE 软件仓库镜像使用帮助
              </h3>
            </Link>
            <Link href="/gentoo/" {...stylex.props(styles.card)}>
              <IconGentoo {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                Gentoo 软件仓库镜像使用帮助
              </h3>
            </Link>
            <Link href="/pypi/" {...stylex.props(styles.card)}>
              <IconPython {...stylex.props(styles.brand_icon)} />
              <h3 {...stylex.props(styles.card_title)}>
                PyPI 软件仓库镜像使用帮助
              </h3>
            </Link>
          </div>
        </section>
        {/** TODO: Logo Cloud Section */}
      </Layout>
      <JsonLD />
    </>
  );
}
