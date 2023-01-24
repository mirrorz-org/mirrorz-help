import { escapeStringRegexp } from 'next/dist/shared/lib/escape-regexp';

export const buildCode = (code: string, variables: Record<string, string>) => {
  for (const [key, value] of Object.entries(variables)) {
    code = code.replace(new RegExp(`{{\\s?${escapeStringRegexp(key)}\\s?}}`, 'g'), value);
  }
  return code;
};

export const buildCatEOF = (finalCode: string, filePath: string) => {
  return `cat <<'EOF' > ${filePath}\n${finalCode}\nEOF`;
};
