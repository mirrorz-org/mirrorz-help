import { memo, useMemo } from 'react';
import { useRenderCode } from './render-code';
import { Code } from '../inline';

interface InlineCodeBlockProps {
  children: React.ReactNode,
  templateId: string,
  codeLanguage?: string
}

function InlineCodeBlock({
  templateId
  // TODO: codeLanguage
}: InlineCodeBlockProps) {
  const finalCode = useRenderCode(templateId, {}, true);
  return (
    <Code>{finalCode}</Code>
  );
}

export default memo(InlineCodeBlock);
