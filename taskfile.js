'use strict';

/* eslint-disable camelcase -- cli */
const path = require('node:path');
const { sync: requireResolve } = require('resolve');

const packages = [];
function fromEsmToCjs(packageName, overrideSource = null) {
  const taskName = `ncc_${packageName.replaceAll('@', '__').replaceAll('-', '_').replaceAll('/', '_')}`;

  const source = overrideSource || path.relative(__dirname, require.resolve(packageName));
  const targetDir = `src/compiled/${packageName}`;
  packages.push(packageName);

  module.exports[taskName] = async function build(task, _opts) {
    const externals = packages.reduce((prev, currentPackageName) => {
      if (currentPackageName !== packageName) {
        prev[currentPackageName] = path.relative(
          path.resolve(__dirname, targetDir),
          path.resolve(__dirname, `src/compiled/${currentPackageName}`)
        );
      }
      return prev;
    }, {});

    await task
      .source(source)
      .ncc({ packageName, externals })
      .target(targetDir);
  };
  return taskName;
}

const tasks = [
  fromEsmToCjs('unified'),
  fromEsmToCjs('@mdx-js/mdx'),
  fromEsmToCjs('remark-gfm'),
  fromEsmToCjs('remark-unwrap-images'),
  fromEsmToCjs('rehype-external-links'),
  fromEsmToCjs('github-slugger'),
  fromEsmToCjs('mdast-util-to-string'),
  fromEsmToCjs('unist-util-visit'),
  fromEsmToCjs('satori', path.relative(__dirname, requireResolve('satori/dist/index.js')))
];

module.exports.write_compiled_ts_declaration = async function write_compiled_ts_declaration(task, _opts) {
  await task
    .source('src/types/compiled.d.ts')
    .dts({ packages })
    .target('src/types');
};
async function ncc(task, opts) {
  await task.clear('src/compiled').parallel(tasks, opts);
  await task.start('write_compiled_ts_declaration');
}
module.exports.ncc = ncc;
/* eslint-enable camelcase -- cli */
