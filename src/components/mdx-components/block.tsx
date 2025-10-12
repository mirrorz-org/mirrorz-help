import { memo } from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  p: {
    marginTop: '0.75rem',
    marginBottom: '1.25rem'
  },
  blockquote: {
    marginTop: '0.75rem',
    marginBottom: '1.5rem',
    paddingBlock: '12px',
    paddingInline: '16px'
  }
});

export const Paragraph = memo((p: React.JSX.IntrinsicElements['p']) => (
  <p {...stylex.props(styles.p)} {...p} />
));
export const Blockquote = memo((p: React.JSX.IntrinsicElements['blockquote']) => (
  <blockquote {...stylex.props(styles.blockquote)} {...p} />
));
