import path from 'node:path';
import fsPromises from 'node:fs/promises';
import { Buffer } from 'node:buffer';
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
  remarkProcessNormalCodeBlock
} from './remark-extract-code-from-codeblock';
import { stringifyNodeOnServer } from '../shared/react-node-json';

import rehypeExternalLinks from '@/compiled/rehype-external-links';

import ErrnoException = NodeJS.ErrnoException;
import { parse as yamlParse } from 'yaml';
import { tokensToMyst } from 'myst-parser';
import mystPlugin from 'markdown-it-myst';
import MarkdownIt from 'markdown-it';
import { VFile } from 'vfile';
import Hogan from 'hogan.js';
import * as visitor from 'unist-util-visit';
import type { Menu, MenuValue, TextInput, InputType, InputCommon } from '@/components/mdx-components/enhanced-codeblock/menus';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';
import { mdxToMarkdown } from 'mdast-util-mdx';
import type { Root as MdastRoot } from 'mdast';

import { renderToStaticMarkup } from 'react-dom/server';

const { FileStore, stableHash } = metroCache;

const docsDir = path.resolve(process.cwd(), 'zdoc');

export interface ToC {
  url: string,
  content: string,
  depth: number
}

export interface ContentProps {
  content: any,
  toc: ToC[],
  meta: MetaFromFrontMatters,
  cname: string,
  compiledTemplates: Record<string, string>,
  globalVariables?: Record<string, MenuValue>
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
const DISK_CACHE_BREAKER = 7;
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

type pageId = string;

interface ZDocInputCommon {
  _: string,
  note?: string
}

interface ZDocInputOptionSelect {
  _?: string,
  [key: string]: string | undefined
}
interface ZDocInputOption extends ZDocInputCommon {
  option: Record<string, ZDocInputOptionSelect>,
  default?: string
}

interface ZDocInputBool extends ZDocInputCommon {
  true?: string | null,
  false?: string | null,
  default?: boolean
}

interface ZDocInputText extends ZDocInputCommon {
  default?: string
}

type ZDocInput = ZDocInputOption | ZDocInputBool | ZDocInputText;

interface ZDocConfigOnDisk {
  _?: string, // Title
  block?: string[],
  input?: Record<string, ZDocInput | null>
};

interface ZDocConfig {
  name: string,
  _: string, // Title
  block: string[],
  input: Record<string, ZDocInput>
}

function pathsForPage(page: pageId, file: string) {
  return {
    local: path.join(docsDir, 'local', page, file),
    global: path.join(docsDir, 'global', page, file)
  };
}

function isErrnoException(error: any): error is ErrnoException {
  return error instanceof Error && (error as ErrnoException).code !== undefined;
}

async function loadFile(page: pageId, file: string, defaultValue?: string): Promise<{ path: string | null, content: string }> {
  const { local: localPath, global: globalPath } = pathsForPage(page, file);

  for (const p of [localPath, globalPath]) {
    try {
      return { path: p, content: await fsPromises.readFile(p, 'utf-8') };
    } catch (err) {
      if (!isErrnoException(err) || err.code !== 'ENOENT') {
        console.error(`Error reading file ${file} for page ${page}: ${(err as Error).message}`);
        throw err;
      }
    }
  }
  if (defaultValue !== undefined) {
    console.warn(`file ${file} not found in page ${page}`);
    return { path: null, content: defaultValue };
  }
  console.error(`file ${file} not found in page ${page}`);
  throw new Error(`file ${file} not found in page ${page}`);
}

async function loadConf(page: pageId, language: string): Promise<ZDocConfig | null> {
  const { local: localPath, global: globalPath } = pathsForPage(
    page,
    `${language}.yaml`
  );
  const tryReadYaml = async (p: string) => {
    let content: string;
    try {
      content = await fsPromises.readFile(p, 'utf-8');
    } catch (err) {
      if (!isErrnoException(err) || err.code !== 'ENOENT') {
        console.error(`Error reading config file ${language}.yaml for page ${page}: ${(err as Error).message}`);
        throw err;
      }
      return [false, null];
    }
    return [true, yamlParse(content)];
  };
  const [localExists, localConf] = await tryReadYaml(localPath) as [boolean, ZDocConfigOnDisk];
  const [globalExists, globalConf] = await tryReadYaml(globalPath) as [boolean, ZDocConfigOnDisk];
  if (!localExists && !globalExists) {
    console.error(`Config file ${language}.yaml not found for page ${page}`);
    return null;
  }
  const inputsGiven = {
    ...globalConf?.input,
    ...localConf?.input
  };
  const inputs = Object.fromEntries(Object.entries(inputsGiven).filter(([_, v]) => v !== null));
  const config = {
    block: ['index'],
    ...globalConf,
    ...localConf,
    input: inputs as Record<string, ZDocInput>,
    name: page
  };
  if (config._ === undefined) {
    throw new Error(`Config file ${language}.yaml for page ${page} must have a title field "_"`);
  }
  return {
    ['_']: config._,
    ...config
  };
};

async function loadBlock(page: pageId, block: string, language: string) {
  return loadFile(page, `${block}.${language}.md`, '');
};

function transpileInput(name: string, input: ZDocInput): InputType {
  const items: Menu['items'] = [];
  const common: InputCommon = {
    title: input._,
    note: input.note
  };
  if ('option' in input) {
    const transpileOption = ([optionName, optionSettings]: [string, ZDocInputOptionSelect]) => {
      const title = optionSettings?._ || optionName;
      const values = {} as MenuValue;
      values[name] = optionName;
      Object.entries(optionSettings || {}).forEach(([k, v]) => {
        if (k === '_') return;
        if (v === undefined) return;
        values[k] = v;
      });
      items.push([title, values]);
    };
    // If there's a default value and it's valid, put it on the top of the list.
    if (input.default && input.option[input.default]) {
      transpileOption([input.default, input.option[input.default]]);
    }
    Object.entries(input.option).forEach(([k, v]) => {
      if (k === input.default) return;
      transpileOption([k, v]);
    });
  } else if ('true' in input || 'false' in input) {
    const transpileBool = (boolValue: boolean) => {
      const val = (input)[boolValue ? 'true' : 'false'];
      items.push([
        boolValue ? '是' : '否',
        {
          [name]: val === null || val === undefined ? boolValue : val
        }
      ]);
    };
    if (input.default) {
      transpileBool(true);
      transpileBool(false);
    } else {
      transpileBool(false);
      transpileBool(true);
    }
  } else {
    return {
      ...common,
      defaultValue: (input as ZDocInputText).default,
      name
    };
  }
  return {
    ...common,
    items
  };
}

function transpileInputToMenuValue(input: string | null | undefined, inputSettings: ZDocConfig['input']): InputType[] | string {
  if (!input) return [];
  const inputNames = input.split(' ');
  const missingInput = inputNames.find((inputName) => inputSettings[inputName] === undefined);
  if (missingInput !== undefined) {
    return missingInput; // The caller will throw an error for this. We return the missing input name to make the error message more specific.
  }
  return input.split(' ').map((inputName: string) => {
    const input = inputSettings[inputName];
    return transpileInput(inputName, input);
  });
}

function createInitialState(menus: InputType[]): MenuValue {
  return menus.reduce<MenuValue>((acc, menu) => {
    const value = 'items' in menu ? menu.items[0][1] || {} : { [menu.name]: menu.defaultValue || '' };
    acc = { ...acc, ...value };
    return acc;
  }, {});
}

function transpileToMdx(blockContent: string, blockPath: string | null, page: pageId, conf: ZDocConfig, globalVariables: Record<string, MenuValue>, generateGlobalMenuId: () => string, templateCompiler: (templateContent: string) => string): string {
  const tokenizer = new MarkdownIt('commonmark').enable('table');
  tokenizer.use(mystPlugin);
  const mdast = tokensToMyst(
    blockContent,
    tokenizer.parse(blockContent, {
      vfile: new VFile(blockPath
        ? {
          path: blockPath
        }
        : null)
    })
  );
  visitor.visit(mdast, ['mystRole', 'mystDirective', 'mystDirectiveError', 'mystRoleError'],
    (node) => {
      if (node.type === 'mystDirectiveError' || node.type === 'mystRoleError') {
        throw new Error(
          `Error parsing directive/role on page ${page}, block ${blockPath}: ${(node as any).message} at line ${node.position?.start.line}, column ${node.position?.start.column}`
        );
      }
      if ((node.type === 'mystDirective' || node.type === 'mystRole') && node.name !== 'ztmpl') {
        throw new Error(
          `Unsupported directive/role ${node.name} on page ${page}, block ${blockPath} at line ${node.position?.start.line}, column ${node.position?.start.column}`
        );
      }
      if (node.type === 'mystRole') {
        const roleOptions = {} as Record<string, string | undefined>;
        node.children?.forEach((child) => {
          if (child.type === 'mystOption') {
            roleOptions[child.name] = child.value;
          }
        });
        const templateContent = node.value || '';
        const templateId = templateCompiler(templateContent);
        node.type = 'mdxJsxTextElement';
        node.name = 'CodeInline';
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'codeLanguage',
            value: roleOptions.lang || undefined
          },
          {
            type: 'mdxJsxAttribute',
            name: 'templateId',
            value: templateId
          }
        ];
        node.children = [];
        return visitor.SKIP;
      }
      const directiveOptions = node.options || {};
      const templateContent = node.value || '';
      const menus = transpileInputToMenuValue(directiveOptions.input, conf.input);
      if (typeof menus === 'string') {
        throw new TypeError(
          `Input "${menus}" used in directive on page ${page}, block ${blockPath} is not defined in [lang].yaml at line ${node.position?.start.line}, column ${node.position?.start.column}`
        );
      }
      if (directiveOptions.global) {
        if (!directiveOptions.input) {
          throw new Error(
            `Global directive must have input variables on page ${page}, block ${blockPath} at line ${node.position?.start.line}, column ${node.position?.start.column}`
          );
        }
        const menuId = generateGlobalMenuId();
        globalVariables[menuId] = createInitialState(menus);
        node.name = 'GlobalMenu';
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'menus',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: JSON.stringify(menus)
            }
          }, {
            type: 'mdxJsxAttribute',
            name: 'id',
            value: menuId
          }
        ];
      } else {
        const templateId = templateCompiler(templateContent);
        node.name = 'CodeBlock';
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'menus',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: JSON.stringify(menus)
            }
          },
          {
            type: 'mdxJsxAttribute',
            name: 'templateId',
            value: templateId
          },
          ...directiveOptions.lang
            ? [{
              type: 'mdxJsxAttribute',
              name: 'codeLanguage',
              value: directiveOptions.lang
            }]
            : [],
          ...directiveOptions.path
            ? [{
              type: 'mdxJsxAttribute',
              name: 'filepath',
              value: directiveOptions.path
            }, {
              type: 'mdxJsxAttribute',
              name: 'enableQuickSetup',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: 'true'
              }
            }]
            : []
        ];
      }
      node.type = 'mdxJsxFlowElement';
      node.children = [];
      return visitor.SKIP;
    });

  return toMarkdown(mdast as MdastRoot, { extensions: [mdxToMarkdown(), gfmTableToMarkdown()] });
}

const language = 'zh';

export async function getContentBySegments(segments: string[]): Promise<{ props: ContentProps } | { notFound: true }> {
  if (segments.length !== 1) {
    return { notFound: true };
  }
  const id = segments[0];
  const conf = await loadConf(id, language);
  if (conf === null) {
    return { notFound: true };
  }
  const blocksNames = conf.block || ['index'];
  const blocksContent = await Promise.all(blocksNames.map(block => loadBlock(id, block, language)));

  const lockfile = await asyncCache('pnpm-lock.yaml', () => fsPromises.readFile(path.join(process.cwd(), 'pnpm-lock.yaml'), { encoding: 'utf-8' }));
  const mdxComponentNames = Object.keys(MDXComponents);

  const hash = Buffer.from(
    stableHash({
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~ IMPORTANT: Everything that the code below may rely on.
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      raw: blocksContent.map(b => b.content).join('\n') + JSON.stringify(conf),
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

  const globalVariables: Record<string, MenuValue> = {};
  const compiledTemplates: Record<string, string> = {};
  const templateDeduplicationMap = new Map<string, string>();
  let globalMenuCounter = 0;
  let pageTemplateCounter = 0;
  const generateGlobalMenuId = () => `globalMenu-${globalMenuCounter++}`;
  const templateCompiler = (templateContent: string) => {
    if (templateDeduplicationMap.has(templateContent)) {
      return templateDeduplicationMap.get(templateContent)!;
    }
    const templateId = `template-${pageTemplateCounter++}`;
    const compiled = Hogan.compile(templateContent, { asString: true });
    compiledTemplates[templateId] = compiled;
    templateDeduplicationMap.set(templateContent, templateId);
    return templateId;
  };
  const transpiledBlocks = blocksContent.map(b => transpileToMdx(b.content, b.path, id, conf, globalVariables, generateGlobalMenuId, templateCompiler));
  const mdx = transpiledBlocks.join('\n\n');
  const meta: MetaFromFrontMatters = {
    title: conf._,
    cname: id
  };
  // If we don't add these fake imports, the MDX compiler
  // will insert a bunch of opaque components we can't introspect.
  // This will break the prepareMDX() call below.
  const mdxWithFakeImports = `${mdx}\n\n${mdxComponentNames
    .map((key) => `import ${key} from "${key}";\n`)
    .join('\n')}`;

  const jsxCode = await compileMdx(mdxWithFakeImports, {
    development: false,
    remarkPlugins: [remarkUnwrapImages, remarkGfm, remarkHeaderCustomId, remarkProcessNormalCodeBlock],
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
      meta,
      globalVariables,
      compiledTemplates,
      cname: meta.cname
    }
  };
  // Cache it on the disk.
  await store.set(hash, output);
  return output;
}

// Get ToC from children
function getTableOfContents(children: React.ReactNode, depth: number) {
  const anchors: ToC[] = [];
  extractHeaders(children, depth, anchors);
  if (anchors.length > 0) {
    anchors.unshift({
      url: '#',
      content: JSON.stringify('Overview', stringifyNodeOnServer),
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

      const header: ToC = {
        url: `#${cprops.id}`,
        depth: (child.type && Number.parseInt(child.type.replace('h', ''), 10)) || 0,
        content: JSON.stringify(cprops.children, stringifyNodeOnServer)
      };
      out.push(header);
    }
    // else if (child.children && depth > 0) {
    //   extractHeaders(child.children, depth - 1, out);
    // }
  }
}
