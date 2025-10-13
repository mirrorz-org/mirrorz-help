import * as stylex from '@stylexjs/stylex';
import ExternalLink from '../external-link';
import NextLink from 'next/link';
import { memo, useMemo } from 'react';
import { mirrorzUrl } from '../../lib/client/constant';
import { useRouter } from 'next/router';

const styles = stylex.create({
  base: {
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

function Link({ href, ...props }: Omit<React.JSX.IntrinsicElements['a'], 'className' | 'ref'>) {
  const processedHref = useMemo(() => {
    if (typeof href !== 'string') {
      return href;
    }

    try {
      const url = new URL(href);
      if (url.origin === 'https://mirrorz.org') {
        url.hostname = mirrorzUrl;
        return url.toString();
      }
      return href;
    } catch {
      return href;
    }
  }, [href]);

  const router = useRouter();

  if (!href) {
    return <a href={href} {...stylex.props(styles.base)} {...props} />;
  }
  if (href.startsWith('https://') || href.startsWith('http://')) {
    return <ExternalLink href={processedHref} {...stylex.props(styles.base)} {...props} />;
  }

  if (href.startsWith('/')) {
    return (
      <NextLink
        href={{
          pathname: href,
          query: router.query.mirror ? { mirror: router.query.mirror || null } : undefined
        }}
        {...stylex.props(styles.base)}
        {...props}
      />
    );
  }

  return <NextLink href={href} {...stylex.props(styles.base)} {...props} />;
}

export default memo(Link);
