import { escapeStringRegexp } from 'next/dist/shared/lib/escape-regexp';

export function buildCode(code: string, variables: Record<string, string>) {
  for (const [key, value] of Object.entries(variables)) {
    code = code.replaceAll(new RegExp(`{{\\s?${escapeStringRegexp(key)}\\s?}}`, 'g'), value);
  }
  return code;
}

export function buildEchoTee(finalCode: string, filePath: string, sudo: boolean) {
  const escapedFinalCode = finalCode.replaceAll('\'', String.raw`\'`);
  return `echo '${escapedFinalCode}\n' | ${sudo ? 'sudo ' : ''}tee ${filePath}`;
}
