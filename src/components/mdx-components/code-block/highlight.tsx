import { lowlight } from 'lowlight/lib/core';
import { toH } from 'hast-to-hyperscript';
import { createElement, useMemo } from 'react';

import md from 'highlight.js/lib/languages/markdown';
import ini from 'highlight.js/lib/languages/ini';
import properties from 'highlight.js/lib/languages/properties';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import yaml from 'highlight.js/lib/languages/yaml';
import lisp from 'highlight.js/lib/languages/lisp';
import julia from 'highlight.js/lib/languages/julia';
import nix from 'highlight.js/lib/languages/nix';
import xml from 'highlight.js/lib/languages/xml';
import r from 'highlight.js/lib/languages/r';

import clsx from 'clsx';

lowlight.registerLanguage('markdown', md);
lowlight.registerAlias({ markdown: ['mdown', 'mkdn', 'mdwn', 'ron'] });

lowlight.registerLanguage('ini', ini);
lowlight.registerAlias({ ini: ['toml', 'conf'] });

lowlight.registerLanguage('properties', properties);

lowlight.registerLanguage('bash', bash);
lowlight.registerAlias({ bash: ['sh', 'zsh', 'fish'] });

// in highlight.js, shell uses bash as its sublanguage.
// "shell" accepts console session (you can use $ as prompts)
// "bash" means file is written in shell (so no $ prompt)
lowlight.registerLanguage('console', shell);
lowlight.registerAlias({ console: ['shell'] });

lowlight.registerLanguage('yaml', yaml);
lowlight.registerAlias({ yaml: ['yml'] });

lowlight.registerLanguage('lisp', lisp);

lowlight.registerLanguage('julia', julia);

lowlight.registerLanguage('nix', nix);

lowlight.registerLanguage('xml', xml);

lowlight.registerLanguage('r', r);

const alias: Record<string, string> = {
  mdown: 'markdown',
  mkdn: 'markdown',
  mdwn: 'markdown',
  ron: 'markdown',

  toml: 'ini',
  sh: 'bash',
  zsh: 'bash',
  fish: 'bash',

  console: 'shell',

  yml: 'yaml',

  text: 'plain'
};

interface LowlightProps {
  code: string;
  language: string;
}

export default function Lowlight({ code, language }: LowlightProps) {
  const tree = useMemo(() => toH(createElement, lowlight.highlight(language, code)), [code, language]);
  return (
    <pre className={clsx('hljs', `language-${alias[language] || language}`)}>
      <code>
        {tree}
      </code>
    </pre>
  );
}
