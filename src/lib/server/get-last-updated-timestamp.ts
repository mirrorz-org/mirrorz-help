import { Repository } from '@napi-rs/simple-git';
import path from 'path';

const fallback = Date.now();

let repo: Repository | undefined;
const rootPath = process.cwd();

export const getLastUpdatedTimestamp = async (file: string): Promise<number> => {
  repo ||= new Repository(rootPath);
  try {
    return repo.getFileLatestModifiedDateAsync(path.relative(rootPath, file));
  } catch {
    return fallback;
  }
};
