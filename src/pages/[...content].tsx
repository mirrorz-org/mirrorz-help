import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ContentProps } from '../lib/server/parse-markdown';
import { getAvaliableSegments, getContentBySegments } from '../lib/server/parse-markdown';
import { Fragment, useMemo } from 'react';
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
function reviveNodeOnClient(parentPropertyName: string, val: any) {
  if (Array.isArray(val) && val[0] === '$r') {
    // Assume it's a React element.
    let Type = val[1];
    let key = val[2];
    if (key == null) {
      key = parentPropertyName; // Index within a parent.
    }
    let props = val[3];
    if (Type === 'wrapper') {
      Type = Fragment;
      props = { children: props.children };
    }
    if (Type in MDXComponents) {
      Type = MDXComponents[Type];
    }
    if (!Type) {
      if (Type !== null) {
        console.error('[reviveNodeOnClient] Unknown type: ' + Type);
      }
      Type = Fragment;
    }
    return <Type key={key} {...props} />;
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
