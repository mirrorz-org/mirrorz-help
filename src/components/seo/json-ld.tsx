import { safeJsonLdReplacer } from '@/lib/shared/safe-jsonld-replacer';
import { usePermalink } from '@/hooks/use-permalink';
import { useMemo } from 'react';
import { siteHost } from '@/lib/client/constant';

const sharedJsonLd = {
  '@context': 'http://schema.org',
  logo: `https://${siteHost}/favicon/android-icon-192x192.png`
};

interface JsonLDProps extends Omit<React.JSX.IntrinsicElements['script'], 'type' | 'dangerouslySetInnerHTML' | 'children' | 'title'> {
  isContent?: boolean,
  title?: string,
  siteName?: string,
  ogImage?: string
}

export default function JsonLD({
  title,
  siteName = 'MirrorZ Help',
  isContent,
  ogImage = `https://${siteHost}/og-${siteHost}/default.png`,
  ...rest
}: JsonLDProps) {
  const jsonMain = useMemo(() => ({
    ...sharedJsonLd,
    // keywords: props.keywords.join(', '),
    description: 'MirrorZ Help 致力于成为一个开源、开放、且持续更新的开源软件镜像的帮助文档整合站点，旨在帮助高校间推广开源软件的使用。',
    '@type': 'WebSite',
    url: `https://${siteHost}`
  }), []);

  const finalTitle = title ? `${title} - ${siteName}` : siteName;
  const permalink = usePermalink(siteHost);

  const data = useMemo(() => {
    if (!isContent) return jsonMain;

    const jsonArticle = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      url: permalink,
      headline: finalTitle,
      image: ogImage ? [ogImage] : [],
      author: []
      // datePublished: '2015-02-05T08:00:00+08:00',
      // dateModified: '2015-02-05T09:20:00+08:00',
      // author: [{
      //   '@type': 'Person',
      //   name: 'Jane Doe',
      //   url: 'https://example.com/profile/janedoe123'
      // }, {
      //   '@type': 'Person',
      //   name: 'John Doe',
      //   url: 'https://example.com/profile/johndoe123'
      // },
      // {"name": "Willow Lane"},
      // {"name": "Regula Felix"}
    };

    return [jsonMain, jsonArticle];
  }, [finalTitle, isContent, jsonMain, ogImage, permalink]);

  return (
    <script
      type="application/ld+json"
      {...rest}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify((Array.isArray(data) && data.length === 1) ? data[0] : data, safeJsonLdReplacer)
      }}
    />
  );
}
