import { memo } from 'react';
import style9 from 'style9';

const styles = style9.create({
  p: {
    marginTop: '0.75rem',
    marginBottom: '1.25rem'
  },
  blockquote: {
    marginTop: '0.75rem',
    marginBottom: '1.5rem',
    padding: '12px 16px'
  }
});

export const Paragraph = memo((p: React.JSX.IntrinsicElements['p']) => (
  <p className={styles('p')} {...p} />
));
export const Blockquote = memo((p: React.JSX.IntrinsicElements['blockquote']) => (
  <blockquote className={styles('blockquote')} {...p} />
));
