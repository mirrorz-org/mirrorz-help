'use strict';

const mdx = require('eslint-plugin-mdx');

module.exports = require('eslint-config-sukka').sukka(
  {
    ignores: {
      customGlobs: [
        'src/compiled/**/*',
        '**/*.{md,mdx}'
      ]
    },
    node: {
      files: [
        '**/*.js'
      ]
    }
  },
  {
    ...mdx.flat,
    // optional, if you want to lint code blocks at the same
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true
    })
  },
  {
    ...mdx.flatCodeBlocks,
    rules: mdx.flatCodeBlocks.rules
  }
);
