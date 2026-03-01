export function buildEchoTee(finalCode: string, filePath: string, sudo: boolean) {
  const escapedFinalCode = finalCode.replaceAll('\'', String.raw`\'`);
  return `echo '${escapedFinalCode}\n' | ${sudo ? 'sudo ' : ''}tee ${filePath}`;
}
