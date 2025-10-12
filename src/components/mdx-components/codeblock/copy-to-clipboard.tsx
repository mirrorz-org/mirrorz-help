import {
  useCallback
} from 'react';
import { useClipboard } from 'foxact/use-clipboard';

import IconCheck from '../../icons/check';
import IconClipboard from '../../icons/clipboard';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  button: {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'var(--bg-codeblock)/.2',
    borderWidth: '1px',
    borderColor: 'var(--border)',
    borderStyle: 'solid',
    color: {
      default: 'var(--text-secondary)',
      ':hover': 'var(--text-primary)'
    },
    borderRadius: '8px',
    padding: '6px'
  },
  icon: {
    width: '16px',
    height: '16px'
  }
});

interface CopyToClipboardProps extends Omit<React.JSX.IntrinsicElements['button'], 'className'> {
  getValue?: () => string,
  value?: string
}

export function CopyToClipboard({
  value,
  getValue,
  ...props
}: CopyToClipboardProps) {
  const { copied, copy } = useClipboard({ timeout: 2500 });

  const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
    const text = value || getValue?.();
    if (text) {
      copy(text);
    }
  }, [copy, getValue, value]);

  return (
    <button
      {...stylex.props(styles.button)}
      onClick={handleClick}
      title="Copy code"
      tabIndex={0}
      type="button"
      {...props}
    >
      {copied
        ? <IconCheck {...stylex.props(styles.icon)} />
        : <IconClipboard {...stylex.props(styles.icon)} />}
    </button>
  );
}
