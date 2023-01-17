import { memo } from 'react';
import style9 from 'style9';

const styles = style9.create({
  strong: {
    fontWeight: 700
  },
  code: {
    display: 'inline',
    fontSize: 14,
    color: 'var(--text-secondary)',
    overflowWrap: 'break-word',
    textDecoration: 'none'
  },
  ol: {
    paddingLeft: '24px',
    marginTop: '12px',
    marginBottom: '24px',
    listStyleType: 'decimal outside'
  },
  ul: {
    paddingLeft: '24px',
    marginTop: '12px',
    marginBottom: '24px',
    listStyleType: 'disc outside'
  },
  li: {
    lineHeight: 1.625,
    listStyleType: 'unset'
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

export const Strong = memo((p: JSX.IntrinsicElements['strong']) => (
  <strong className={styles('strong')} {...p} />
));
export const OL = memo((p: JSX.IntrinsicElements['ol']) => (
  <ol className={styles('ol')} {...p} />
));
export const LI = memo((p: JSX.IntrinsicElements['li']) => (
  <li className={styles('li')} {...p} />
));
export const UL = memo((p: JSX.IntrinsicElements['ul']) => (
  <ul className={styles('ul')} {...p} />
));
export const Divider = memo((p: JSX.IntrinsicElements['hr']) => (
  <hr className={styles('hr')} {...p} />
));
export const Code = memo((p: JSX.IntrinsicElements['code']) => (
  <code className={styles('code')} {...p} />
));
export const EM = memo((p: JSX.IntrinsicElements['em']) => (
  <em className={styles('em')} {...p} />
));
