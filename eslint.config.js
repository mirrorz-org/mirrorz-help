'use strict';

const mdx = require('eslint-plugin-mdx');

module.exports = require('eslint-config-sukka').sukka(
  {
    ignores: {
      customGlobs: [
        'src/compiled/**/*',
        '**/*.{md,mdx}',
        'src/components/cmdk/index.tsx'
      ]
    },
    node: {
      files: [
        '**/*.js'
      ]
    }
  },
  {
    files: [
      'src/pages/**/*.tsx'
    ],
    rules: {
      '@eslint-react/naming-convention/filename': 'off'
    }
  },
  {
    files: [
      'src/contexts/**/*.tsx'
    ],
    rules: {
      'react-refresh/only-export-components': 'off'
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
