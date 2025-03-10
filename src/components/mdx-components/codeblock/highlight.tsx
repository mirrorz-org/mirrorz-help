import { createLowlight } from 'lowlight';
import { useMemo } from 'react';

/**
 * This is a runtime version of React 17+ new JSX transform.
 * So we are accessing those exports that "doesn't exist"
 */
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';

import md from 'highlight.js/lib/languages/markdown';
import ini from 'highlight.js/lib/languages/ini';
import properties from 'highlight.js/lib/languages/properties';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import lisp from 'highlight.js/lib/languages/lisp';
import julia from 'highlight.js/lib/languages/julia';
import nix from 'highlight.js/lib/languages/nix';
import xml from 'highlight.js/lib/languages/xml';
import r from 'highlight.js/lib/languages/r';
import powershell from 'highlight.js/lib/languages/powershell';
import clojure from 'highlight.js/lib/languages/clojure';
import dos from 'highlight.js/lib/languages/dos';
import perl from 'highlight.js/lib/languages/perl';
import json from 'highlight.js/lib/languages/json';

import clsx from 'clsx';

const lowlight = createLowlight();

lowlight.register('markdown', md);
lowlight.registerAlias({ markdown: ['mdown', 'mkdn', 'mdwn', 'ron'] });

lowlight.register('ini', ini);
lowlight.registerAlias({ ini: ['toml', 'conf'] });

lowlight.register('properties', properties);

lowlight.register('bash', bash);
lowlight.registerAlias({ bash: ['sh', 'zsh', 'fish', 'shell'] });

lowlight.register('yaml', yaml);
lowlight.registerAlias({ yaml: ['yml'] });

lowlight.register('lisp', lisp);

lowlight.register('julia', julia);

lowlight.register('nix', nix);

lowlight.register('xml', xml);

lowlight.register('r', r);

lowlight.register('powershell', powershell);

lowlight.register('clojure', clojure);

lowlight.register('dos', dos);

lowlight.register('perl', perl);

lowlight.register('json', json);

const alias: Record<string, string> = {
  mdown: 'markdown',
  mkdn: 'markdown',
  mdwn: 'markdown',
  ron: 'markdown',

  toml: 'ini',
  sh: 'bash',
  zsh: 'bash',
  fish: 'bash',
  shell: 'bash',
  console: 'bash',

  yml: 'yaml',

  text: 'plain'
};

interface LowlightProps {
  code: string,
  language: string
}

export default function Lowlight({ code, language }: LowlightProps) {
  const tree = useMemo(() => toJsxRuntime(lowlight.highlight(language, code), { Fragment, jsx: jsx as any, jsxs: jsxs as any }), [code, language]);
  return (
    <pre className={clsx('hljs', `language-${alias[language] || language}`)}>
      <code>
        {tree}
      </code>
    </pre>
  );
}
