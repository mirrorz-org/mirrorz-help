export function buildEchoTee(finalCode: string, filePath: string, sudo: boolean, append: boolean) {
  const escapedFinalCode = finalCode.replaceAll('\'', String.raw`'"'"'`);
  return `printf '%s' '${escapedFinalCode}\n' | ${sudo ? 'sudo ' : ''}tee ${append ? '-a ' : ''}${filePath}`;
}
