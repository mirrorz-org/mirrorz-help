import { clsx } from 'clsx';
import { Suspense, lazy, memo, useMemo } from 'react';
import * as stylex from '@stylexjs/stylex';
import { CopyToClipboard } from './copy-to-clipboard';

import buttonGroupStyles from './buttongroup.module.css';

const Lowlight = lazy(() => import('./highlight'));

interface NormalCodeBlockProps {
  code: string,
  language?: string | undefined
}

const styles = stylex.create({
  container: {
    position: 'relative',
    marginBottom: '24px'
  },
  button_group: {
    display: 'flex',
    columnGap: '4px',
    rowGap: '4px',
    position: 'absolute',
    margin: '12px',
    right: 0,
    top: 0
  }
});

function SyntaxHighlight({ code, language }: NormalCodeBlockProps) {
  const fallback = useMemo(() => (
    <pre>
      <code>
        {code}
      </code>
    </pre>
  ), [code]);

  return (
    <div
      {...stylex.props(styles.container)}
      className={clsx('lowlight', buttonGroupStyles.parent, stylex.props(styles.container).className)}
    >
      <Suspense fallback={fallback}>
        {
          language
            ? <Lowlight code={code} language={language} />
            : fallback
        }
      </Suspense>
      <div
        {...stylex.props(styles.button_group)}
        className={clsx(stylex.props(styles.button_group).className, buttonGroupStyles.group)}
      >
        <CopyToClipboard value={code} />
      </div>
    </div>
  );
}

export default memo(SyntaxHighlight);
