import Head from 'next/head';
import { useDarkMode } from '@/contexts/darkmode';
import { useMemo } from 'react';
import { usePermalink } from '@/hooks/use-permalink';
import { jsonEndpoint, siteHost } from '@/lib/client/constant';

interface SeoHeadProps {
  title?: string,
  siteName?: string,
  description?: string,
  noindex?: boolean,
  nofollow?: boolean,
  twitterCardType?: 'summary_large_image' | 'summary',
  ogType?: 'website' | 'article',
  ogImage?: { url: string, width?: number | undefined, height?: number | undefined }
}

export default function SeoHead({
  title,
  siteName = 'MirrorZ Help',
  description,
  noindex = false,
  nofollow = false,
  twitterCardType = 'summary_large_image',
  ogType = 'website',
  // eslint-disable-next-line @eslint-react/no-unstable-default-props -- immutable
  ogImage = {
    url: `https://${siteHost}/og-${siteHost}/default.png`,
    width: 1200,
    height: 630
  }
}: SeoHeadProps) {
  const finalTitle = title ? `${title} - ${siteName}` : siteName;
  const finalDescription = useMemo(
    () => [
      title,
      description,
      '镜像使用帮助',
      'MirrorZ Help 致力于成为一个开源、开放、且持续更新的开源软件镜像的帮助文档整合站点，旨在帮助高校间推广开源软件的使用。'
    ].filter(Boolean).join(' - '),
    [description, title]
  );
  const robotDirectives = useMemo(
    () => [
      noindex ? 'noindex' : 'index',
      nofollow ? 'nofollow' : 'follow'
    ].join(','),
    [nofollow, noindex]
  );
  const darkMode = useDarkMode();
  const permalink = usePermalink(siteHost);

  const jsonEndpointOrigin = useMemo(() => {
    const url = new URL(jsonEndpoint);
    return url.origin;
  }, []);

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title key="title">{finalTitle}</title>
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link key="preconnect" rel="preconnect" crossOrigin="anonymous" href={jsonEndpointOrigin} />

      {/** Favicon */}
      <link key="favicon.svg" rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
      <link
        key="apple-icon-180x180.png"
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-icon-180x180.png"
      />
      <link
        key="android-icon-192x192.png"
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/favicon/android-icon-192x192.png"
      />
      <link key="favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link key="favicon-96x96.png" rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
      <link key="favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link key="favicon.ico" rel="shortcut icon" type="image/png" sizes="16x16" href="/favicon.ico" />

      <meta name="format-detection" content="telephone=no" />

      {/** Basic SEO tags */}
      <meta
        key="description"
        name="description"
        content={finalDescription}
      />
      <link key="canonical" rel="canonical" href={permalink} />
      <meta
        key="robots"
        name="robots"
        content={robotDirectives}
      />

      {/* Open Graph */}
      <meta key="og:type" property="og:type" content={ogType} />
      <meta key="og:title" property="og:title" content={finalTitle} />
      <meta key="og:url" property="og:url" content={permalink} />
      <meta key="og:site_name" property="og:site_name" content={siteName} />
      <meta key="og:description" property="og:description" content={finalDescription} />
      <meta key="og:locale" property="og:locale" content="zh-Hans" />
      <meta key="og:image" property="og:image" content={ogImage.url} />
      {!!ogImage.width && (
        <meta
          key="og:image:width"
          property="og:image:width"
          content={ogImage.width.toString()}
        />
      )}
      {!!ogImage.height && (
        <meta
          key="og:image:height"
          property="og:image:height"
          content={ogImage.height.toString()}
        />
      )}
      <meta key="twitter:image" name="twitter:image" content={ogImage.url} />
      <meta
        key="twitter:card"
        name="twitter:card"
        content={twitterCardType}
      />

      {/* Theme Color */}
      {darkMode === 'auto' && <meta key="theme-color-light" name="theme-color" content="#fff" />}
      {darkMode === 'auto' && <meta key="theme-color-dark" name="theme-color" content="#27272a" media="(prefers-color-scheme: dark)" />}
      {darkMode === 'light' && <meta key="theme-color-light" name="theme-color" content="#fff" />}
      {darkMode === 'dark' && <meta key="theme-color-dark" name="theme-color" content="#27272a" />}

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      {/** TODO: support both mirrorz and cernet.edu.cn */}
      <link key="preload-mirrorz" rel="preload" href={jsonEndpoint} as="fetch" crossOrigin="anonymous" />
    </Head>
  );
}
