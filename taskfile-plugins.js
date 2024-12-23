'use strict';

const findUp = require('find-up');
const ncc = require('@vercel/ncc');
const { existsSync, readFileSync } = require('node:fs');
const { basename, dirname, extname, join, resolve } = require('node:path');
const { Module } = require('node:module');

// See taskfile.js bundleContext definition for explanation
const m = new Module(resolve(__dirname, 'bundles', '_'));
m.filename = m.id;
m.paths = Module._nodeModulePaths(m.id);
const bundleRequire = m.require;
bundleRequire.resolve = (request, options) => Module._resolveFilename(request, m, false, options);

module.exports = function (task, _utils) {
  // eslint-disable-next-line require-yield -- taskr plugin
  task.plugin('ncc', {}, function *(file, options) {
    if (options.externals && options.packageName) {
      options.externals = { ...options.externals };
      delete options.externals[options.packageName];
    }

    return ncc(join(__dirname, file.dir, file.base), {
      filename: file.base,
      minify: options.minify !== false,
      assetBuilds: true,
      esm: false,
      target: 'es2019',
      ...options
    }).then(({ code, assets }) => {
      Object.keys(assets).forEach((key) => {
        const data = assets[key].source;

        this._.files.push({
          data,
          base: basename(key),
          dir: join(file.dir, dirname(key))
        });
      });

      if (options && options.packageName) {
        writePackageManifest.call(
          this,
          options.packageName,
          file.base,
          options.bundleName
        );
      }

      file.data = new TextEncoder().encode(code);
    });
  });

  // eslint-disable-next-line require-yield -- taskr plugin
  task.plugin('dts', {}, function *(file, options) {
    const code = options.packages
      .map(packageName => `declare module '@/compiled/${packageName}' {\n  import * as p from '${packageName}';\n  export = p;\n}\n`)
      .join('\n');
    return Promise.resolve().then(() => {
      file.data = new TextEncoder().encode(code, 'utf8');
    });
  });
};

// This function writes a minimal `package.json` file for a compiled package.
// It defines `name`, `main`, `author`, and `license`. It also defines `types`.
// n.b. types intended for development usage only.
function writePackageManifest(packageName, main, bundleName) {
  // some newer packages fail to include package.json in the exports
  // so we can't reliably use require.resolve here
  let packagePath;

  try {
    packagePath = bundleRequire.resolve(`${packageName}/package.json`);
  } catch {
    packagePath = findUp.sync('package.json', {
      cwd: dirname(bundleRequire.resolve(packageName))
    });
  }
  const { name, author, license } = require(packagePath);

  const compiledPackagePath = join(
    __dirname,
    `src/compiled/${bundleName || packageName}`
  );

  const potentialLicensePath = join(dirname(packagePath), './LICENSE');
  if (existsSync(potentialLicensePath)) {
    this._.files.push({
      dir: compiledPackagePath,
      base: 'LICENSE',
      data: readFileSync(potentialLicensePath, 'utf8')
    });
  } else {
    // license might be lower case and not able to be found on case-sensitive
    // file systems (ubuntu)
    const otherPotentialLicensePath = join(dirname(packagePath), './license');
    if (existsSync(otherPotentialLicensePath)) {
      this._.files.push({
        dir: compiledPackagePath,
        base: 'LICENSE',
        data: readFileSync(otherPotentialLicensePath, 'utf8')
      });
    }
  }

  this._.files.push({
    dir: compiledPackagePath,
    base: 'package.json',
    data:
      `${JSON.stringify(
        Object.assign(
          {},
          { name, main: basename(main, `.${extname(main)}`) },
          author ? { author } : undefined,
          license ? { license } : undefined
        )
      )}\n`
  });
}
