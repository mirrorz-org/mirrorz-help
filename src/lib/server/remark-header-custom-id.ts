/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/*!
 * Based on 'gatsby-remark-autolink-headers'
 * Original Author: Kyle Mathews <mathews.kyle@gmail.com>
 * Updated by Jared Palmer;
 * Copyright (c) 2015 Gatsbyjs
 */

import { toString } from '@/compiled/mdast-util-to-string';
import { visit } from '@/compiled/unist-util-visit';
import { slug as toSlug } from '@/compiled/github-slugger';

function patch(context: any, key: string, value: any) {
  if (!context[key]) {
    context[key] = value;
  }
  return context[key];
}

export default function remarkHeaderCustomId() {
  return function transformer(tree: any) {
    const ids = new Set();
    visit(tree, 'heading', (node) => {
      const children = [...node.children];
      let id;
      if (children[children.length - 1].type === 'mdxTextExpression') {
        // # My header {/*my-header*/}
        id = children.pop().value;
        const isValidCustomId = id.startsWith('/*') && id.endsWith('*/');
        if (!isValidCustomId) {
          throw new Error(`Expected header ID to be like: {/*some-header*/}. Instead, received: ${id}`);
        }
        id = id.slice(2, -2);
        if (id !== toSlug(id)) {
          throw new Error(`Expected header ID to be a valid slug. You specified: {/*${id}*/}. Replace it with: {/*${toSlug(id)}*/}`);
        }
      } else {
        // # My header
        id = toSlug(toString(node));
      }

      if (ids.has(id)) {
        throw new Error(
          `Cannot have a duplicate header with id "${id}" on the page. `
          + 'Rename the section or give it an explicit unique ID. '
          + 'For example: #### Arguments {/*setstate-arguments*/}'
        );
      }
      ids.add(id);

      const data = patch(node, 'data', {});
      patch(data, 'id', id);
      patch(data, 'htmlAttributes', {});
      patch(data, 'hProperties', {});
      patch(data.htmlAttributes, 'id', id);
      patch(data.hProperties, 'id', id);
    });
  };
}
