import { Suspense, lazy, memo } from 'react';

const Lowlight = lazy(() => import('./highlight'));

interface NormalCodeBlockProps {
  code: string;
  language: string | undefined;
}

function SyntaxHighlight({ code, language }: NormalCodeBlockProps) {
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

export default memo(SyntaxHighlight);
