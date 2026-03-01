import { memo } from 'react';
import { useRenderCode } from './render-code';
import { Code } from '../inline';

interface InlineCodeBlockProps {
  children: React.ReactNode,
  code: string,
  codeLanguage?: string
}

function InlineCodeBlock({
  code
  // TODO: codeLanguage
}: InlineCodeBlockProps) {
  const finalCode = useRenderCode(code, {}, true);
  return (
    <Code>{finalCode}</Code>
  );
}

export default memo(InlineCodeBlock);
