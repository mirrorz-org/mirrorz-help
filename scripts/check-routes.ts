import routesJson from '@/routes.json';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function getMdxFilesList(directory: string): string[] {
  const files = fs.readdirSync(directory);
  const mdxFiles = files.filter(file => path.extname(file) === '.mdx');
  return mdxFiles.map(file => path.join(directory, file));
}

const mdxFiles = getMdxFilesList(path.join(process.cwd(), 'contents'));
const mdxTable = new Set<string>();
for (const mdxFile of mdxFiles) {
  const filePath = path.basename(mdxFile, '.mdx');
  const fileUrl = '/' + filePath + '/';
  mdxTable.add(fileUrl);
  if (!(fileUrl in routesJson)) {
    console.warn(`${mdxFile} not in routes.json!`);
  }
}
for (const route in routesJson) {
  if (!mdxTable.has(route)) {
    console.warn(`${route} not in contents dir!`);
  }
}
