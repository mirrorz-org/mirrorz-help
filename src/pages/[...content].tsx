import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ContentProps } from '../lib/server/parse-markdown';
import { getAvaliableSegments, getContentBySegments } from '../lib/server/parse-markdown';
import { Fragment, useMemo } from 'react';
import { MDXComponents } from '../components/mdx-components';
import { Layout } from '../components/layout';
import SeoHead from '../components/seo/head';

export default function ContentPage({ content, toc, meta, cname }: ContentProps) {
  const parsedContent = useMemo(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );

  return (
    <>
      <SeoHead
        title={meta.title}
        ogType="article"
        ogImage={{
          url: `https://help.mirrorz.org/og-help.mirrorz.org/${cname}.png`,
          width: 1200,
          height: 630
        }}
      />
      <Layout meta={meta as any} toc={toc} cname={cname} isContent>
        {parsedContent}
      </Layout>
    </>
  );
}

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(key: unknown, val: any) {
  if (Array.isArray(val) && val[0] === '$r') {
    // Assume it's a React element.
    let type = val[1];
    const key = val[2];
    let props = val[3];
    if (type === 'wrapper') {
      type = Fragment;
      props = { children: props.children };
    }
    if (MDXComponents[type]) {
      type = MDXComponents[type];
    }
    if (!type) {
      // eslint-disable-next-line no-console -- log error
      // console.error(`Unknown type: ${type}`);
      type = Fragment;
    }
    return {
      $$typeof: Symbol.for('react.element'),
      type,
      key,
      ref: null,
      props,
      _owner: null
    };
  }
  return val;
}

export const getStaticProps: GetStaticProps<ContentProps, { content: string[], cname: string }> = (context) => {
  return getContentBySegments(context.params?.content || []);
};

export const getStaticPaths: GetStaticPaths = async () => {
  const segments = await getAvaliableSegments();
  const paths = segments.map(segment => ({
    params: { content: segment }
  }));

  return {
    fallback: false,
    paths
  };
};
