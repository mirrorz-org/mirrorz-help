import * as stylex from '@stylexjs/stylex';
import { Layout } from '../components/layout';
import { Paragraph } from '../components/mdx-components/block';
import Link from 'next/link';
import SeoHead from '../components/seo/head';
import ExternalLink from '../components/external-link';
import { issueUrl } from '../lib/client/constant';

const styles = stylex.create({
  main: {
    marginTop: {
      default: '32px',
      '@media (min-width: 840px)': '40px'
    },
    marginBottom: {
      default: '32px',
      '@media (min-width: 840px)': '40px'
    }
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.25,
    marginBottom: '24px',
    color: 'var(--text-primary)'
  },
  content: {
    fontSize: 18
  },
  link: {
    color: 'var(--text-link)',
    display: 'inline',
    borderBottomWidth: '1px',
    borderBottomColor: {
      default: 'transparent',
      ':hover': 'var(--text-link)'
    },
    borderBottomStyle: 'solid',
    transitionDuration: '100ms',
    transitionProperty: 'color',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
    lineHeight: 1.5
  }
});

export default function ServerErrorPage() {
  return (
    <>
      <SeoHead
        title="500 Internal Server Error"
      />
      <Layout>
        <div {...stylex.props(styles.main)}>
          <h1 {...stylex.props(styles.title)}>500 Internal Server Error</h1>
          <article {...stylex.props(styles.content)}>
            <Paragraph>
              服务器在处理你的请求时发生了错误。
            </Paragraph>
            <Paragraph>
              你也可以 <ExternalLink href={issueUrl} {...stylex.props(styles.link)}>通过 GitHub Issue 反馈这个问题</ExternalLink>，或者 <Link href="/" {...stylex.props(styles.link)}>返回首页</Link>。
            </Paragraph>
          </article>
        </div>
      </Layout>
    </>
  );
}
