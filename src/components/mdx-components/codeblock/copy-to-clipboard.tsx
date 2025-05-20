import {
  useCallback
} from 'react';
import { useClipboard } from 'foxact/use-clipboard';

import IconCheck from '../../icons/check';
import IconClipboard from '../../icons/clipboard';
import style9 from 'style9';

const styles = style9.create({
  button: {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'var(--bg-codeblock)/.2',
    borderWidth: '1px',
    borderColor: 'var(--border)',
    borderStyle: 'solid',
    color: 'var(--text-secondary)',
    borderRadius: '8px',
    padding: '6px',
    ':hover': {
      color: 'var(--text-primary)'
    }
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
      className={styles('button')}
      onClick={handleClick}
      title="Copy code"
      tabIndex={0}
      type="button"
      {...props}
    >
      {copied
        ? <IconCheck className={styles('icon')} />
        : <IconClipboard className={styles('icon')} />}
    </button>
  );
}
