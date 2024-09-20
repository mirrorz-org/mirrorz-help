import clsx from 'clsx';
import { memo } from 'react';
import { typescriptHappyForwardRef } from 'foxact/typescript-happy-forward-ref';
import style9 from 'style9';
import type { StyleWithAtRulesAndFalsy } from '@/types/style9';

import headingAnchorStyles from './heading.module.css';
import { EMPTY_ARRAY } from '../../lib/client/constant';

const styles = style9.create({
  base: {
    scrollMarginTop: '3em',
    paddingRight: '16px', // spacing for anchor
    '@media screen and (min-width: 1024px)': {
      scrollMarginTop: '1em'
    },
    '::before': {
      height: '96px',
      visibility: 'hidden',
      content: '""'
    }
  },
  anchor_link: {
    display: 'inline-block',
    // Prevent the anchor from overflowing to its own line
    width: 0,
    height: 0
  },
  anchor: {
    color: 'var(--anchor)',
    marginLeft: '8px',
    height: '20px',
    width: '20px',
    display: 'inline'
  },
  hidden: {
    display: 'none'
  },
  inline_block: {
    display: 'inline-block'
  },
  h1: {
    fontSize: 32,
    fontWeight: 600,
    lineHeight: '2.5rem'
  },
  h2: {
    fontSize: 24,
    lineHeight: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
    marginTop: '24px',
    marginBottom: '16px',
    letterSpacing: '0.02em'
  },
  h3: {
    fontSize: 20,
    lineHeight: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
    marginTop: '24px',
    marginBottom: '16px',
    letterSpacing: '0.02em'
  },
  h4: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '1.5rem',
    marginTop: '24px',
    marginBottom: '16px'
  },
  h5: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '1.5rem',
    marginTop: '24px',
    marginBottom: '16px'
  }
});

type HeadingProps<T extends React.ElementType> = Omit<
  React.PropsWithChildren<React.ComponentPropsWithoutRef<T>>,
  'className'
> & {
  xstyle?: StyleWithAtRulesAndFalsy[],
  isPageAnchor?: boolean,
  children: React.ReactNode,
  id?: string,
  as?: T
};

export const Heading = typescriptHappyForwardRef(<T extends 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>(
  { as, children, id, isPageAnchor = true, xstyle = EMPTY_ARRAY, ...props }: HeadingProps<T>,
  ref: React.ForwardedRef<HTMLHeadingElement> | null
) => {
  const label = typeof children === 'string' ? `Link for ${children}` : 'Link for this heading';
  const Comp = as || 'h2';
  const beaconClassName = (Comp === 'h2' || Comp === 'h3') && 'toc-heading-anchor';

  return (
    <Comp id={id} {...props} ref={ref} className={clsx(beaconClassName, headingAnchorStyles.heading, style9(styles.base, ...xstyle))}>
      {children}
      {isPageAnchor && (
        <a
          href={`#${id || ''}`}
          aria-label={label}
          title={label}
          className={clsx(headingAnchorStyles.anchor, styles('anchor_link', Comp === 'h1' ? 'hidden' : 'inline_block'))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" className={styles('anchor')}>
            <g fill="currentColor" fillRule="evenodd">
              <path d="M7.778 7.975a2.5 2.5 0 0 0 .347-3.837L6.017 2.03a2.498 2.498 0 0 0-3.542-.007 2.5 2.5 0 0 0 .006 3.543l1.153 1.15c.07-.29.154-.563.25-.773a2.46 2.46 0 0 1 .14-.25L3.18 4.85a1.496 1.496 0 0 1 .002-2.12 1.496 1.496 0 0 1 2.12 0l2.124 2.123a1.496 1.496 0 0 1-.333 2.37c.16.246.42.504.685.752z" />
              <path d="M5.657 4.557a2.5 2.5 0 0 0-.347 3.837l2.108 2.108a2.498 2.498 0 0 0 3.542.007 2.5 2.5 0 0 0-.006-3.543L9.802 5.815c-.07.29-.154.565-.25.774-.036.076-.084.16-.14.25l.842.84c.585.587.59 1.532 0 2.122a1.495 1.495 0 0 1-2.12 0L6.008 7.68a1.496 1.496 0 0 1 .332-2.372c-.16-.245-.42-.503-.685-.75z" />
            </g>
          </svg>
        </a>
      )}
    </Comp>
  );
});

const h1Xstyle = [styles.h1];
export const H1 = memo((props: HeadingProps<'h1'>) => (
  <Heading as="h1" xstyle={h1Xstyle} {...props} />
));

const h2Xstyle = [styles.h2];
export const H2 = memo((props: HeadingProps<'h2'>) => (
  <Heading as="h2" xstyle={h2Xstyle} {...props} />
));

const h3Xstyle = [styles.h3];
export const H3 = memo((props: HeadingProps<'h3'>) => (
  <Heading as="h3" xstyle={h3Xstyle} {...props} />
));

const h4Xstyle = [styles.h4];
export const H4 = memo((props: HeadingProps<'h4'>) => (
  <Heading as="h4" xstyle={h4Xstyle} {...props} />
));

const h5Xstyle = [styles.h5];
export const H5 = memo((props: HeadingProps<'h5'>) => (
  <Heading as="h5" xstyle={h5Xstyle} {...props} />
));
