'use strict';

const { withStyleX } = require('stylex-webpack/next');
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })
  : (x) => x;

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer(withStyleX({
  nextjsAppRouterMode: false
})({
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  output: 'export'
}));
