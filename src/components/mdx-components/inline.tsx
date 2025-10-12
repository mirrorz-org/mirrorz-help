import { memo } from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  strong: {
    fontWeight: 700
  },
  code: {
    display: 'inline',
    fontSize: 15,
    color: 'var(--text-secondary)',
    overflowWrap: 'break-word',
    textDecoration: 'none'
  },
  ol: {
    paddingLeft: '24px',
    marginTop: '12px',
    marginBottom: '24px',
    listStyleType: 'decimal',
    listStylePosition: 'outside'
  },
  ul: {
    paddingLeft: '24px',
    marginTop: '12px',
    marginBottom: '24px',
    listStyleType: 'disc',
    listStylePosition: 'outside'
  },
  li: {
    lineHeight: 1.625
  },
  hr: {
    marginTop: '24px',
    marginBottom: '24px',
    display: 'block',
    borderBottomWidth: '1px',
    borderTopWidth: '0px',
    borderColor: 'var(--border)'
  },
  em: {
    fontStyle: 'italic'
  }
});

export const Strong = memo((p: React.JSX.IntrinsicElements['strong']) => (
  <strong {...stylex.props(styles.strong)} {...p} />
));
export const OL = memo((p: React.JSX.IntrinsicElements['ol']) => (
  <ol {...stylex.props(styles.ol)} {...p} />
));
export const LI = memo((p: React.JSX.IntrinsicElements['li']) => (
  <li {...stylex.props(styles.li)} {...p} />
));
export const UL = memo((p: React.JSX.IntrinsicElements['ul']) => (
  <ul {...stylex.props(styles.ul)} {...p} />
));
export const Divider = memo((p: React.JSX.IntrinsicElements['hr']) => (
  <hr {...stylex.props(styles.hr)} {...p} />
));
export const Code = memo((p: React.JSX.IntrinsicElements['code']) => (
  <code {...stylex.props(styles.code)} {...p} />
));
export const EM = memo((p: React.JSX.IntrinsicElements['em']) => (
  <em {...stylex.props(styles.em)} {...p} />
));
