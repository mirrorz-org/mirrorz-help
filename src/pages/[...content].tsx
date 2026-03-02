import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ContentProps } from '../lib/server/parse-markdown';
import { getAvaliableSegments, getContentBySegments } from '../lib/server/parse-markdown';
import { useMemo } from 'react';
import { Layout } from '../components/layout';
import SeoHead from '../components/seo/head';
import JsonLD from '../components/seo/json-ld';
import DocumentationWrapper from '../components/documentation-wrapper';
import { reviveNodeOnClient } from '../lib/shared/react-node-json';
import { PageGlobalVariableProvider } from '@/contexts/page-global-variable';

export default function ContentPage({ content, toc, meta, cname, globalVariables }: ContentProps) {
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
          <PageGlobalVariableProvider initialState={globalVariables || {}}>
            {parsedContent}
          </PageGlobalVariableProvider>
        </DocumentationWrapper>
      </Layout>
      <JsonLD isContent title={meta.title} />
    </>
  );
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
