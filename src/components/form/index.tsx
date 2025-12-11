import * as stylex from '@stylexjs/stylex';
import type { StyleXRulesAndFalsy } from '@/types/stylex';
import { stylexPropsWithClassName } from '../../lib/shared/stylex';

interface InputExtraProps {
  prefix?: React.ReactNode,
  suffix?: React.ReactNode,
  inputXstyle?: StyleXRulesAndFalsy[] | StyleXRulesAndFalsy
}

const styles = stylex.create({
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)'
  },
  input: {
    display: 'block',
    width: '100%',
    appearance: 'none',
    borderRadius: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    fontSize: {
      default: 15,
      '@media (min-width: 840px)': 13
    },
    lineHeight: 1.25,
    backgroundColor: {
      default: 'var(--bg-secondary)',
      ':focus': 'var(--bg-wash)'
    },
    '::placeholder': {
      color: 'var(--text-shallow)'
    }
  }
});

function Input({ ref: forwardedRef, prefix, suffix, className, inputXstyle, ...props }: InputExtraProps & React.JSX.IntrinsicElements['input'] & { ref?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      {prefix}
      <input
        ref={forwardedRef}
        spellCheck={false}
        {...stylexPropsWithClassName(stylex.props(styles.input, inputXstyle), className)}
        {...props}
      />
      {suffix}
    </div>
  );
}

export default Input;
