import { Default } from '@/opengraph/template';
import satori from '@/compiled/satori';
import * as metroCache from 'metro-cache';
import { Resvg } from '@resvg/resvg-js';
import path from 'path';
import { promises as fsPromises } from 'fs';
import * as Log from 'next/dist/build/output/log';
import { fileExists } from 'next/dist/lib/file-exists';
// import pLimit from 'next/dist/compiled/p-limit';

// import routesJson from '@/routes.json';

const outputRoot = path.join(process.cwd(), 'public', 'og-help.mirrorz.org');

const lockFile = fsPromises.readFile(path.join(process.cwd(), 'package-lock.json'), { encoding: 'utf-8' });
const templateSourceCode = fsPromises.readFile(path.join(process.cwd(), 'src', 'opengraph', 'template.tsx'), { encoding: 'utf-8' });

const notoSansRegular = fsPromises.readFile(path.join(process.cwd(), 'vendors', 'Noto_Sans_SC', 'NotoSansSC-Regular.otf'));
const notoSansMedium = fsPromises.readFile(path.join(process.cwd(), 'vendors', 'Noto_Sans_SC', 'NotoSansSC-Medium.otf'));
const notoSansBold = fsPromises.readFile(path.join(process.cwd(), 'vendors', 'Noto_Sans_SC', 'NotoSansSC-Bold.otf'));

const { FileStore, stableHash } = metroCache as any;
const store = new FileStore({
  root: `${process.cwd()}/node_modules/.cache/mirrorz-help-open-graph-cache/`
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~   IMPORTANT: BUMP THIS IF YOU CHANGE ANY CODE BELOW    ~~~
// ~~~~ IMPORTANT: BUMP THIS IF YOU UPDATE THE NOTO SANS FONTS ~~~
const DISK_CACHE_BREAKER = 0;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

interface GenerateOpengraphOptions<T> {
  template: (props: T) => JSX.Element;
  props: T;
  id: string;
  outputPath: string;
}

async function generateOpengraph<T = any>({
  template,
  props,
  id,
  outputPath
}: GenerateOpengraphOptions<T>) {
  const cacheKey = Buffer.from(
    stableHash({
      props,
      templateSourceCode: await templateSourceCode,
      DISK_CACHE_BREAKER,
      lockFile: await lockFile,
      id
    })
  );

  const cached = await store.get(cacheKey);
  if (cached) {
    Log.info(
      `[OG] Reading open graph image "${id}" from ./node_modules/.cache/`
    );

    return fsPromises.writeFile(outputPath, cached);
  }
  Log.info(
    `[OG] Cache miss for open graph image "${id}" from ./node_modules/.cache/`
  );

  const [
    notoSansRegularData,
    notoSansBoldData,
    notoSansMediumData
  ] = await Promise.all([
    notoSansRegular,
    notoSansBold,
    notoSansMedium
  ]);
  const svg = await satori(
    template(props),
    {
      embedFont: true,
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSans SC',
          data: notoSansRegularData,
          weight: 400,
          style: 'normal'
        },
        {
          name: 'NotoSans SC',
          data: notoSansMediumData,
          weight: 500,
          style: 'normal'
        },
        {
          name: 'NotoSans SC',
          data: notoSansBoldData,
          weight: 700,
          style: 'normal'
        }
      ]
    }
  );

  const pngBuffer = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200
    }
  }).render().asPng();

  await store.set(cacheKey, pngBuffer);

  return fsPromises.writeFile(outputPath, pngBuffer);
}

(async () => {
  if (!await fileExists(outputRoot, 'directory')) {
    await fsPromises.mkdir(outputRoot, { recursive: true });
  }

  // Default OpenGraph
  const defaultOgPath = path.join(outputRoot, 'default.png');
  await generateOpengraph({
    template: Default,
    props: {
      siteName: 'MirrorZ Help',
      domain: 'mirrors.help'
    },
    id: 'default',
    outputPath: defaultOgPath
  });

  // await Promise.all(Object.entries(routesJson).map(async ([routeHref, routeMeta]) => {
  //   if (!routeMeta.fullTitle.startsWith(routeMeta.title)) {
  //     Log.warn(`[Routes.json] Route ${routeHref} has a "fullTitle" that does not start with "title". Skipping.`);
  //     return null;
  //   }

  //   return limit(() => generateOpengraph({
  //     template: Content,
  //     props: {
  //       siteName: 'MirrorZ Help',
  //       path: routeHref,
  //       titleLine1: routeMeta.title,
  //       titleLine2: routeMeta.fullTitle.replace(routeMeta.title, '').trim(),
  //       domain: 'help.mirrorz.org'
  //     },
  //     id: routeMeta.cname,
  //     outputPath: path.join(outputRoot, `${routeMeta.cname}.png`)
  //   }));
  // }));
})();
