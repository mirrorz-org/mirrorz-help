import React, {
  useCallback,
  useEffect,
  useState
} from 'react';

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

interface CopyToClipboardProps extends Omit<JSX.IntrinsicElements['button'], 'className'> {
  getValue?: () => string,
  value?: string
}

export const CopyToClipboard = ({
  value,
  getValue,
  ...props
}: CopyToClipboardProps) => {
  const [isCopied, setCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timerId = setTimeout(() => {
      setCopied(false);
    }, 2500);

    return () => clearTimeout(timerId);
  }, [isCopied]);

  const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(async () => {
    if (!navigator?.clipboard) {
      // eslint-disable-next-line no-console -- log error to console
      console.error('Access to clipboard rejected!');
    }
    try {
      const text = value || getValue?.();
      if (text) {
        setCopied(true);
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // eslint-disable-next-line no-console -- log error to console
      console.error('Failed to copy!');
    }
  }, [getValue, value]);

  return (
    <button
      className={styles('button')}
      onClick={handleClick}
      title="Copy code"
      tabIndex={0}
      {...props}>
      {isCopied
        ? <IconCheck className={styles('icon')} />
        : <IconClipboard className={styles('icon')} />}
    </button>
  );
};
