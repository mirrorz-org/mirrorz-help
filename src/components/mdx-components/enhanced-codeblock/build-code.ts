import { escapeStringRegexp } from 'next/dist/shared/lib/escape-regexp';

export const buildCode = (code: string, variables: Record<string, string>) => {
  for (const [key, value] of Object.entries(variables)) {
    code = code.replaceAll(new RegExp(`{{\\s?${escapeStringRegexp(key)}\\s?}}`, 'g'), value);
  }
  return code;
};

export const buildEchoTee = (finalCode: string, filePath: string, sudo: boolean) => {
  const escapedFinalCode = finalCode.replace(/'/g, "\\'");
  return `echo '${escapedFinalCode}\n' | ${sudo ? 'sudo ' : ''}tee ${filePath}`;
};
