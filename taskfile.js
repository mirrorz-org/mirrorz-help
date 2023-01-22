/* eslint-disable camelcase -- cli */
const { relative, resolve } = require('path');

const packages = [];
const fromEsmToCjs = (packageName) => {
  const taskName = `ncc_${packageName.replaceAll('@', '__').replaceAll('-', '_').replaceAll('/', '_')}`;

  const sourceDir = relative(__dirname, require.resolve(packageName));
  const targetDir = `src/compiled/${packageName}`;
  packages.push(packageName);

  module.exports[taskName] = async function build(task, _opts) {
    const externals = packages.reduce((prev, currentPackageName) => {
      if (currentPackageName !== packageName) {
        prev[currentPackageName] = relative(
          resolve(__dirname, targetDir),
          resolve(__dirname, `src/compiled/${currentPackageName}`)
        );
      }
      return prev;
    }, {});

    await task
      .source(sourceDir)
      .ncc({ packageName, externals })
      .target(targetDir);
  };
  return taskName;
};

const tasks = [
  fromEsmToCjs('unified'),
  fromEsmToCjs('@mdx-js/mdx'),
  fromEsmToCjs('remark-gfm'),
  fromEsmToCjs('remark-unwrap-images'),
  fromEsmToCjs('remark-external-links'),
  fromEsmToCjs('github-slugger'),
  fromEsmToCjs('mdast-util-to-string'),
  fromEsmToCjs('unist-util-visit'),
  fromEsmToCjs('satori')
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
