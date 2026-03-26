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

const customIdRegex = / {#(?<id>.+)}$/;

export default function remarkHeaderCustomId() {
  return function transformer(tree: any) {
    const ids = new Set();
    visit(tree, 'heading', (node) => {
      const lastChildren = node.children.at(-1);
      if (lastChildren?.type !== 'text') {
        return;
      }
      let id;
      const matched = customIdRegex.exec(lastChildren.value);
      if (matched?.groups) {
        // # My header {#my-header}
        id = matched.groups.id;
        if (id !== toSlug(id)) {
          throw new Error(`Expected header ID to be a valid slug. You specified: {#${id}}`);
        }
        lastChildren.value = lastChildren.value.slice(0, matched.index);
      } else {
        // # My header
        id = toSlug(toString(node));
      }

      if (ids.has(id)) {
        throw new Error(
          `Cannot have a duplicate header with id "${id}" on the page. `
          + 'Rename the section or give it an explicit unique ID. '
          + 'For example: #### Arguments {#setstate-arguments}'
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
