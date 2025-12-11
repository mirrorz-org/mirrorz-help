import * as stylex from '@stylexjs/stylex';
import MetaCard from './metacard';
import { memo } from 'react';

interface PageHeadingProps {
  title: string,
  description?: string
}

const styles = stylex.create({
  wrapper: {
    paddingLeft: {
      default: '20px',
      '@media (min-width: 640px)': '48px'
    },
    paddingRight: {
      default: '20px',
      '@media (min-width: 640px)': '48px'
    },
    paddingTop: {
      default: '32px',
      '@media (min-width: 640px)': '28px',
      '@media (min-width: 840px)': '20px'
    },
    paddingBottom: '24px'
  },
  container: {
    maxWidth: '1280px',
    marginLeft: {
      default: 0,
      '@media (min-width: 1280px)': 'auto'
    },
    marginRight: {
      '@media (min-width: 1280px)': 'auto'
    }
  },
  h1: {
    marginTop: 0,
    color: 'var(--text-primary)',
    overflowWrap: 'break-word',
    fontSize: 32,
    fontWeight: 600,
    lineHeight: '2.5rem'
  },
  description: {
    marginTop: '16px',
    marginBottom: '24px',
    color: 'var(--text-primary)',
    fontSize: 20,
    lineHeight: 1.8
  }
});

function Header({
  title,
  description
}: PageHeadingProps) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.container)}>
        <h1 {...stylex.props(styles.h1)}>
          {title}
        </h1>
        {description && (
          <p {...stylex.props(styles.description)}>
            {description}
          </p>
        )}
        <MetaCard />
      </div>
    </div>
  );
}

export default memo(Header);
