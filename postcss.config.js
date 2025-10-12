'use strict';

/** @type {Record<'plugins', import('postcss').AcceptedPlugin[]>} */
module.exports = {
  plugins: [
    require.resolve('next/dist/compiled/postcss-flexbugs-fixes'),
    [
      require.resolve('next/dist/compiled/postcss-preset-env'),
      {
        browsers: ['defaults'],
        autoprefixer: {
          // Disable legacy flexbox support
          flexbox: 'no-2009'
        },
        // Enable CSS features that have shipped to the
        // web platform, i.e. in 2+ browsers unflagged.
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ],
    [
      require.resolve('postcss-sort-media-queries'),
      {
        sort: 'mobile-first' // default value
      }
    ]
  ]
};
