import { Suspense, lazy } from 'react';

const Lowlight = lazy(() => import('./highlight'));

interface ActualCodeProps {
  code: string;
  language: string | undefined;
}

export default function ActualCode({ code, language }: ActualCodeProps) {
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
