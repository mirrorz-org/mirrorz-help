import style9 from 'style9';
import { Layout } from '../components/layout';
import { Paragraph } from '../components/mdx-components/block';
import Link from 'next/link';
import { useSetSearchOpen } from '../contexts/search';
import { useCallback } from 'react';
import SeoHead from '../components/seo/head';
import ExternalLink from '../components/external-link';
import { issueUrl } from '../lib/client/constant';

const styles = style9.create({
  main: {
    marginTop: '32px',
    marginBottom: '32px',
    '@media screen and (min-width: 840px)': {
      marginTop: '40px',
      marginBottom: '40px'
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
    borderBottomColor: 'transparent',
    borderBottomStyle: 'solid',
    transitionDuration: '100ms',
    transitionProperty: 'color',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
    lineHeight: 1.5,
    ':hover': {
      borderBottomColor: 'var(--text-link)'
    }
  }
});

export default function NotFoundPage() {
  const setSearchOpen = useSetSearchOpen();
  const handleSearchButtonClick = useCallback(() => {
    setSearchOpen(true);
  }, [setSearchOpen]);

  return (
    <>
      <SeoHead
        title="404 Not Found"
        noindex
      />
      <Layout>
        <div className={styles('main')}>
          <h1 className={styles('title')}>404 Page Not Found</h1>
          <article className={styles('content')}>
            <Paragraph>
              你当前请求的页面不存在。
            </Paragraph>
            <Paragraph>
              如果你正在寻找一个软件镜像的使用帮助，很有可能这篇文档还没有完成。
            </Paragraph>
            <Paragraph>
              你可以尝试使用
              {' '}
              <button onClick={handleSearchButtonClick} className={styles('link')}>
                搜索
              </button>
              {' '}
              找到你想要查看的内容，或者 <Link href="/" className={styles('link')}>返回首页</Link>。
            </Paragraph>
            <Paragraph>
              你也可以 <ExternalLink href={issueUrl} className={styles('link')}>通过 GitHub Issue 反馈这个问题</ExternalLink>。
            </Paragraph>
          </article>
        </div>
      </Layout>
    </>
  );
}
