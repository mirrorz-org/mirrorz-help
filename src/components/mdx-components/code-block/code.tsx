import { Suspense, lazy, memo } from 'react';

const Lowlight = lazy(() => import('./highlight'));

interface ActualCodeProps {
  code: string;
  language: string | undefined;
}

function ActualCode({ code, language }: ActualCodeProps) {
  const fallback = (
    <pre>
      <code>
        {code}
      </code>
    </pre>
  );

  return (
    <Suspense fallback={fallback}>
      {
        language
          ? <Lowlight code={code} language={language} />
          : fallback
      }
    </Suspense>
  );
}

export default memo(ActualCode);
