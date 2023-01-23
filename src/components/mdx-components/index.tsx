import { Blockquote, Paragraph } from './block';
import { H1, H2, H3, H4, H5 } from './heading';
import { Code, Divider, LI, OL, Strong, UL } from './inline';
import Link from './link';
import SyntaxHighlight from './codeblock';
import EnhancedCodeBlock from './enhanced-codeblock';

import type React from 'react';

export const MDXComponents: Record<string, React.ComponentType<any>> = {
  a: Link,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  p: Paragraph,
  blockquote: Blockquote,
  code: Code,
  strong: Strong,
  ol: OL,
  ul: UL,
  li: LI,
  hr: Divider,
  CodeBlock: EnhancedCodeBlock,
  SyntaxHighlight
};
