export type OS = 'undetermined' | 'macos' | 'ios' | 'windows' | 'android' | 'linux';

const macosPlatforms = /macintosh|macintel|macppc|mac68k/i;
const windowsPlatforms = /win32|win64|windows|wince/i;
const iosPlatforms = /iphone|ipad|ipod/i;

export function getOS(): OS {
  const { userAgent } = window.navigator;

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
}

// export function useOs(): OS {
//   return useMemo(() => {
//     if (typeof window !== 'undefined') {
//       return getOS();
//     }

//     return 'undetermined';
//   }, []);
// }
