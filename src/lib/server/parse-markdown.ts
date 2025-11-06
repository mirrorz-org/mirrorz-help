import path from 'node:path';
import fsPromises from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { default as matter } from 'gray-matter';
import * as metroCache from 'metro-cache';

import routesJson from '@/routes.json';

import * as Log from 'next/dist/build/output/log';

import { transform } from '@swc/core';
import { MDXComponents } from '@/components/mdx-components';
import { Children } from 'react';

import type React from 'react';
import type { MetaFromFrontMatters } from '@/types/front-matter';

import { compile as compileMdx } from '@/compiled/@mdx-js/mdx';
import remarkGfm from '@/compiled/remark-gfm';
import remarkUnwrapImages from '@/compiled/remark-unwrap-images';
import remarkHeaderCustomId from './remark-header-custom-id';
import {
  remarkExtractCodeFromEnhancedCodeBlock,
  remarkProcessNormalCodeBlock
} from './remark-extract-code-from-codeblock';

import rehypeExternalLinks from '@/compiled/rehype-external-links';

const { FileStore, stableHash } = metroCache;

const contentsPath = path.resolve(process.cwd(), 'contents');

export interface ToC {
  url: string,
  text: string,
  depth: number
}

export interface ContentProps {
  content: any,
  toc: ToC[],
  meta: MetaFromFrontMatters,
  cname: string
}

function fromHrefToSegments(href: string) {
  return href.replaceAll(/^\/|\/$/g, '').split('/');
}

export function getAvaliableSegments() {
  return Promise.resolve(Object.keys(routesJson).map(p => fromHrefToSegments(p)));
}

const _cache = new Map();
async function asyncCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (_cache.has(key)) return _cache.get(key);
  const result = await fn();
  _cache.set(key, result);
  return result;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~ IMPORTANT: BUMP THIS IF YOU CHANGE ANY CODE BELOW ~~~
const DISK_CACHE_BREAKER = 6;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const store = new FileStore({
  root: `${process.cwd()}/node_modules/.cache/mirrorz-help-mdx-cache/`
});

function fakeRequire(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- fake require
  if (name === 'react/jsx-runtime') return require('react/jsx-runtime');
  // For each fake MDX import, give back the string component name.
  // It will get serialized later.
  return name;
}

export async function getContentBySegments(segments: string[]): Promise<{ props: ContentProps } | { notFound: true }> {
  const id = segments.length === 0 ? 'index' : (segments.join('/') || 'index');
  let raw;
  try {
    raw = await fsPromises.readFile(path.resolve(contentsPath, `${id}.mdx`), { encoding: 'utf-8' });
  } catch (e1: any) {
    if ('code' in e1 && e1.code === 'ENOENT') {
      try {
        raw = await fsPromises.readFile(path.resolve(contentsPath, `${id}/index.mdx`), { encoding: 'utf-8' });
      } catch (e2: any) {
        if ('code' in e2 && e2.code === 'ENOENT') {
          Log.warn('[CMS]', id, 'not found');
          return {
            notFound: true
          };
        }
        throw e2;
      }
    }
    throw e1;
  }

  const lockfile = await asyncCache('pnpm-lock.yaml', () => fsPromises.readFile(path.join(process.cwd(), 'pnpm-lock.yaml'), { encoding: 'utf-8' }));
  const mdxComponentNames = Object.keys(MDXComponents);

  const hash = Buffer.from(
    stableHash({
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~ IMPORTANT: Everything that the code below may rely on.
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      raw,
      mdxComponentNames,
      DISK_CACHE_BREAKER,
      lockfile
    })
  );

  const cached = await store.get(hash);
  if (cached) {
    if (process.env.NODE_ENV !== 'production') {
      Log.info(
        `[CMS] Reading compiled MDX for /${id} from ./node_modules/.cache/`
      );
    }
    return cached as any;
  }
  Log.info(
    `[CMS] Cache miss for MDX for /${id} from ./node_modules/.cache/`
  );

  const { data: meta, content: mdx } = matter(raw);
  // If we don't add these fake imports, the MDX compiler
  // will insert a bunch of opaque components we can't introspect.
  // This will break the prepareMDX() call below.
  const mdxWithFakeImports = `${mdx}\n\n${mdxComponentNames
    .map((key) => `import ${key} from "${key}";\n`)
    .join('\n')}`;

  const jsxCode = await compileMdx(mdxWithFakeImports, {
    development: false,
    remarkPlugins: [remarkUnwrapImages, remarkGfm, remarkHeaderCustomId, remarkProcessNormalCodeBlock, remarkExtractCodeFromEnhancedCodeBlock],
    rehypePlugins: [rehypeExternalLinks]
  });

  const { code } = await transform(jsxCode.toString('utf-8'), { module: { type: 'commonjs' } });

  const fakeExports = { default: (_arg: any): React.JSX.Element => ({} as any) };

  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func -- see below
  const evalJSCode = new Function('require', 'exports', code);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // THIS IS A BUILD-TIME EVAL. NEVER DO THIS WITH UNTRUSTED MDX (LIKE FROM CMS)!!!
  // In this case it's okay because anyone who can edit our MDX can also edit this file.
  evalJSCode(fakeRequire, fakeExports);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const reactTree = fakeExports.default({});
  const toc = getTableOfContents(reactTree.props.children, 10);

  const output = {
    props: {
      toc,
      content: JSON.stringify(reactTree, stringifyNodeOnServer),
      meta: meta as MetaFromFrontMatters,
      cname: meta.cname
    }
  };
  // Cache it on the disk.
  await store.set(hash, output);
  return output;
}

// Serialize a server React tree node to JSON.
function stringifyNodeOnServer(key: unknown, val: any) {
  if (
    val?.$$typeof === Symbol.for('react.transitional.element')
  ) {
    // Remove fake MDX props.

    const { mdxType, originalType, parentName, ...cleanProps } = val.props;
    return [
      '$r',
      typeof val.type === 'string' ? val.type : mdxType,
      val.key,
      cleanProps
    ];
  }
  return val;
}

// Get ToC from children
function getTableOfContents(children: React.ReactNode, depth: number) {
  const anchors: ToC[] = [];
  extractHeaders(children, depth, anchors);
  if (anchors.length > 0) {
    anchors.unshift({
      url: '#',
      text: 'Overview',
      depth: 2
    });
  }
  return anchors;
}

const headerTypes = new Set([
  'h1',
  'h2',
  'h3'
]);
function extractHeaders(children: React.ReactNode, depth: number, out: ToC[]) {
  for (const child of Children.toArray(children)) {
    if (typeof child === 'object' && 'type' in child && typeof child.type === 'string' && headerTypes.has(child.type)) {
      const cprops = child.props as Record<string, any>;

      const header = {
        url: `#${cprops.id}`,
        depth: (child.type && Number.parseInt(child.type.replace('h', ''), 10)) || 0,
        text: cprops.children
      };
      out.push(header);
    }
    // else if (child.children && depth > 0) {
    //   extractHeaders(child.children, depth - 1, out);
    // }
  }
}
