import clsx from 'clsx';
import { Suspense, lazy, memo, useMemo } from 'react';
import style9 from 'style9';
import { CopyToClipboard } from './copy-to-clipboard';

import buttonGroupStyles from './buttongroup.module.css';

const Lowlight = lazy(() => import('./highlight'));

interface NormalCodeBlockProps {
  code: string,
  language?: string | undefined
}

const styles = style9.create({
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
    <div className={clsx('lowlight', buttonGroupStyles.parent, styles('container'))}>
      <Suspense fallback={fallback}>
        {
          language
            ? <Lowlight code={code} language={language} />
            : fallback
        }
      </Suspense>
      <div className={clsx(styles('button_group'), buttonGroupStyles.group)}>
        <CopyToClipboard value={code} />
      </div>
    </div>
  );
}

export default memo(SyntaxHighlight);
