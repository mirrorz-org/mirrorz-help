import path from 'path';
import fsPromises from 'fs/promises';
import { default as matter } from 'gray-matter';
import * as metroCache from 'metro-cache';

import routesJson from '@/routes.json';

import * as Log from 'next/dist/build/output/log';

import { transform } from '@swc/core';
import { MDXComponents } from '../components/mdx-components';
import { Children } from 'react';

import type React from 'react';

const { FileStore, stableHash } = metroCache as any;

const contentsPath = path.resolve(process.cwd(), 'contents');

export interface ToC {
  url: string;
  text: string;
  depth: number
}

export interface ContentProps {
  content: any;
  toc: ToC[];
  meta: {
    [key: string]: any;
  };
}

const fromHrefToSegments = (href: string) => {
  return href.replace(/^\/|\/$/g, '').split('/');
};

export const getAvaliableSegments = async () => {
  return Object.keys(routesJson).map(p => fromHrefToSegments(p));
};

const _cache = new Map();
const asyncCache = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  if (_cache.has(key)) return _cache.get(key);
  const result = await fn();
  _cache.set(key, result);
  return result;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~ IMPORTANT: BUMP THIS IF YOU CHANGE ANY CODE BELOW ~~~
const DISK_CACHE_BREAKER = 0;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const store = new FileStore({
  root: `${process.cwd()}/node_modules/.cache/xtom-com-markdown-cache/`
});

export const getContentBySegments = async (segments: string[]): Promise<{ props: ContentProps } | { notFound: true }> => {
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

  const lockfile = await asyncCache('package-lock.json', () => fsPromises.readFile(path.join(process.cwd(), 'package-lock.json'), { encoding: 'utf-8' }));
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
    Log.info(
      `[CMS] Reading compiled MDX for /${id} from ./node_modules/.cache/`
    );
    return cached;
  }
  if (process.env.NODE_ENV === 'production') {
    Log.info(
      `[CMS] Cache miss for MDX for /${id} from ./node_modules/.cache/`
    );
  }

  const { data: meta, content: mdx } = matter(raw);
  // If we don't add these fake imports, the MDX compiler
  // will insert a bunch of opaque components we can't introspect.
  // This will break the prepareMDX() call below.
  const mdxWithFakeImports = `${mdx}\n\n${mdxComponentNames
    .map((key) => `import ${key} from "${key}";\n`)
    .join('\n')}`;

  const [
    { compile: compileMdx },
    { default: remarkExternalLinks },
    { default: remarkUnwrapImages },
    { default: remarkGfm }
  ] = await Promise.all([
    import('@mdx-js/mdx'),
    import('remark-external-links'),
    import('remark-unwrap-images'),
    import('remark-gfm')
  ]);

  const jsxCode = await compileMdx(mdxWithFakeImports, {
    development: false,
    remarkPlugins: [remarkExternalLinks, remarkUnwrapImages, remarkGfm],
    rehypePlugins: []
  });

  const { code } = await transform(jsxCode.toString('utf-8'), { module: { type: 'commonjs' } });

  const fakeExports = { default: (_arg: any): React.ReactElement => ({} as any) };
  const fakeRequire = (name: string) => {
    if (name === 'react/jsx-runtime') return require('react/jsx-runtime');
    // For each fake MDX import, give back the string component name.
    // It will get serialized later.
    return name;
  };
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
      meta
    }
  };
  // Cache it on the disk.
  await store.set(hash, output);
  return output;
};

// Serialize a server React tree node to JSON.
function stringifyNodeOnServer(key: string, val: any) {
  if (val != null && val.$$typeof === Symbol.for('react.element')) {
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
function getTableOfContents(children: React.ReactElement, depth: number) {
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
function extractHeaders(children: React.ReactElement, depth: number, out: ToC[]) {
  for (const child of Children.toArray(children)) {
    if (typeof child === 'object' && 'type' in child && typeof child.type === 'string' && headerTypes.has(child.type)) {
      const header = {
        url: `#${child.props.id}`,
        depth: (child.type && Number.parseInt(child.type.replace('h', ''), 10)) || 0,
        text: child.props.children
      };
      out.push(header);
    }
    // else if (child.children && depth > 0) {
    //   extractHeaders(child.children, depth - 1, out);
    // }
  }
}
