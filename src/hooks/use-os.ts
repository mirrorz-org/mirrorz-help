import { useMemo } from 'react';

export type OS = 'undetermined' | 'macos' | 'ios' | 'windows' | 'android' | 'linux';

export const getOS = (): OS => {
  const { userAgent } = window.navigator;
  const macosPlatforms = /(macintosh)|(macintel)|(macppc)|(mac68k)/i;
  const windowsPlatforms = /(win32)|(win64)|(windows)|(wince)/i;
  const iosPlatforms = /(iphone)|(ipad)|(ipod)/i;

  if (macosPlatforms.test(userAgent)) {
    return 'macos';
  }
  if (iosPlatforms.test(userAgent)) {
    return 'ios';
  }
  if (windowsPlatforms.test(userAgent)) {
    return 'windows';
  }
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  if (/linux/i.test(userAgent)) {
    return 'linux';
  }

  return 'undetermined';
};

export const useOs = (): OS => useMemo(() => {
  if (typeof window !== 'undefined') {
    return getOS();
  }

  return 'undetermined';
}, []);
