import { memo, useMemo } from 'react';
import { useRenderCode } from './render-code';
import { Code } from '../inline';

interface InlineCodeBlockProps {
  children: React.ReactNode,
  code: string,
  codeLanguage?: string
}

function InlineCodeBlock({
  code: base64Code
  // TODO: codeLanguage
}: InlineCodeBlockProps) {
  const code = useMemo(() => atob(base64Code), [base64Code]);
  const finalCode = useRenderCode(code, {}, true);
  return (
    <Code>{finalCode}</Code>
  );
}

export default memo(InlineCodeBlock);
