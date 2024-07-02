import routesJson from '@/routes.json';
import fs from 'fs';
import path from 'path';
import process from 'process';

function getMdxFilesList(directory: string): string[] {
    const files = fs.readdirSync(directory);
    const mdxFiles = files.filter(file => path.extname(file) === '.mdx');
    return mdxFiles.map(file => path.join(directory, file));
}

const mdxFiles = getMdxFilesList(path.join(process.cwd(), "contents"));
let mdxTable = new Set<string>;
for (let mdxFile of mdxFiles) {
    let filePath = path.basename(mdxFile, '.mdx');
    let fileUrl = '/' + filePath + '/';
    mdxTable.add(fileUrl);
    if (!(fileUrl in routesJson)) {
        console.warn(`${mdxFile} not in routes.json!`)
    }
}
for (let route in routesJson) {
    if (!mdxTable.has(route)) {
        console.warn(`${route} not in contents dir!`)
    }
}
