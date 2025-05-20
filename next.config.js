'use strict';

const withStyle9 = require('style9-webpack/next');
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })
  : (x) => x;

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer(withStyle9({
  incrementalClassnames: false,
  minifyProperties: process.env.NODE_ENV === 'production'
})({
  trailingSlash: true,
  reactStrictMode: true,
  output: 'export',
  experimental: {
    optimizeCss: process.env.NODE_ENV === 'production'
      ? {
        logLevel: 'warn'
      }
      : false
  }
}));
