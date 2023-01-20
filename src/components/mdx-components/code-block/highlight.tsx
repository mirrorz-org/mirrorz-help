import { lowlight } from 'lowlight/lib/core';
import { toH } from 'hast-to-hyperscript';
import { createElement, useMemo } from 'react';

import md from 'highlight.js/lib/languages/markdown';
import ini from 'highlight.js/lib/languages/ini';
import properties from 'highlight.js/lib/languages/properties';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
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

const alias: Record<string, string> = {
  mdown: 'markdown',
  mkdn: 'markdown',
  mdwn: 'markdown',
  ron: 'markdown',

  toml: 'ini',
  sh: 'bash',
  zsh: 'bash',
  fish: 'bash',

  console: 'shell'
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
