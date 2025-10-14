import * as stylex from '@stylexjs/stylex';
import type { StyleXRulesAndFalsy } from '@/types/stylex';
import { clsx } from 'clsx';
import { EMPTY_ARRAY } from '../../lib/client/constant';

interface InputExtraProps {
  prefix?: React.ReactNode,
  suffix?: React.ReactNode,
  inputXstyle?: StyleXRulesAndFalsy[]
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
      '@media screen and (min-width: 840px)': 13
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

function Input({ ref: forwardedRef, prefix, suffix, className, inputXstyle = EMPTY_ARRAY, ...props }: InputExtraProps & React.JSX.IntrinsicElements['input'] & { ref?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      {prefix}
      <input
        ref={forwardedRef}
        spellCheck={false}
        {...stylex.props(styles.input, ...inputXstyle)}
        className={clsx(className, stylex.props(styles.input, ...inputXstyle).className)}
        {...props}
      />
      {suffix}
    </div>
  );
}

export default Input;
