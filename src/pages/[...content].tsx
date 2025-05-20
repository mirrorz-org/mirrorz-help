import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ContentProps } from '../lib/server/parse-markdown';
import { getAvaliableSegments, getContentBySegments } from '../lib/server/parse-markdown';
import { createElement, Fragment, useMemo } from 'react';
import { MDXComponents } from '../components/mdx-components';
import { Layout } from '../components/layout';
import SeoHead from '../components/seo/head';
import JsonLD from '../components/seo/json-ld';
import DocumentationWrapper from '../components/documentation-wrapper';

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
        // ogImage={{
        //   url: `https://${siteHost}/og-${siteHost}/${cname}.png`,
        //   width: 1200,
        //   height: 630
        // }}
      />
      <Layout meta={meta} toc={toc} cname={cname} isContent>
        <DocumentationWrapper>
          {parsedContent}
        </DocumentationWrapper>
      </Layout>
      <JsonLD isContent title={meta.title} />
    </>
  );
}

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(key: unknown, val: unknown) {
  if (
    Array.isArray(val)
    && (
      val[0] === '$r'
      || val[0] === '$r1'
      || val[0] === '$r2'
      || val[0] === '$r3'
    )
  ) {
    // Assume it's a React element.
    let type = val[1];
    const key = val[2];
    let props = val[3];
    if (type === 'wrapper') {
      type = Fragment;
      props = { children: props.children };
    }
    if (type in MDXComponents) {
      type = MDXComponents[type];
    }
    if (!type) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console -- log error
        console.warn(`Unknown type: ${type}`);
      }
      type = Fragment;
    }
    return createElement(type, key ? Object.assign(props, { key }) : props);
  }
  return val;
}

export const getStaticProps: GetStaticProps<ContentProps, { content: string[], cname: string }> = (context) => getContentBySegments(context.params?.content || []);

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
