import { forwardRef } from 'react';
import style9 from 'style9';
import type { StyleWithAtRulesAndFalsy } from '@/types/style9';
import clsx from 'clsx';
import { EMPTY_ARRAY } from '../../lib/client/constant';

interface InputExtraProps {
  prefix?: React.ReactNode,
  suffix?: React.ReactNode,
  inputXstyle?: StyleWithAtRulesAndFalsy[]
}

const styles = style9.create({
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
    fontSize: 15,
    lineHeight: 1.25,
    '@media screen and (min-width: 840px)': {
      fontSize: 13
    },
    backgroundColor: 'var(--bg-secondary)',
    ':focus': {
      backgroundColor: 'var(--bg-wash)'
    },
    '::placeholder': {
      color: 'var(--text-shallow)'
    }
  }
});

function Input({ ref: forwardedRef, prefix, suffix, className, inputXstyle = EMPTY_ARRAY, ...props }: InputExtraProps & React.JSX.IntrinsicElements['input'] & { ref?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className={styles('wrapper')}>
      {prefix}
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={clsx(className, style9(styles.input, ...inputXstyle))}
        {...props}
      />
      {suffix}
    </div>
  );
}

export default Input;
