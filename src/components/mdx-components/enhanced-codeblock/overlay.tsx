import { memo } from 'react';
import style9 from 'style9';

const styles = style9.create({
  hidden: {
    display: 'none'
  },
  icon: {
    width: '24px',
    height: '24px',
    zIndex: 1001
  },
  outer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  inner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    backgroundColor: 'var(--bg-codeblock)/.2'
  }
});

function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  return (
    <div className={styles({
      outer: true,
      hidden: !isLoading
    })}
    >
      <svg className={styles('icon')} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" role="presentation"><g fill="none" fillRule="evenodd"><g transform="translate(2.5 2.5)" strokeWidth="5"><circle strokeOpacity=".5" cx="16" cy="16" r="16" /><path d="M32 16c0-9.94-8.06-16-16-16"><animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      <div className={styles('inner')} />
    </div>
  );
}

export default memo(LoadingOverlay);
