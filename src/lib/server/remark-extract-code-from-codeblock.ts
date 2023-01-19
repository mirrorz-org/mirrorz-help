import * as Log from 'next/dist/build/output/log';

import { toString } from '@/compiled/mdast-util-to-string';
import { visit, SKIP } from '@/compiled/unist-util-visit';

export default function remarkExtractCodeFromCodeBlock() {
  return function transformer(tree: any) {
    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name === 'CodeBlock') {
        if (node.children.length === 1) {
          const firstChild = node.children[0];
          if (firstChild.type === 'code') {
            const code = toString(firstChild);
            node.attributes ||= [];
            node.attributes.push({
              type: 'mdxJsxAttribute',
              name: 'code',
              value: code
            });
            if (firstChild.lang) {
              node.attributes.push({
                type: 'mdxJsxAttribute',
                name: 'codeLanguage',
                value: firstChild.lang
              });
            }
            if (firstChild.meta) {
              node.attributes.push({
                type: 'mdxJsxAttribute',
                name: 'codeMeta',
                value: firstChild.meta
              });
            }
            node.children = [];
            return SKIP;
          }

          Log.warn(`<CodeBlock /> only allow code block as its children, but got "${firstChild.name || firstChild.type}". This <CodeBlock /> will be ignored.`);
          parent.children.splice(index, 1);
          return [SKIP, index];
        }

        Log.warn('<CodeBlock /> only allow one children, but got', node.children.length, '. This <CodeBlock /> will be ignored.');
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}
