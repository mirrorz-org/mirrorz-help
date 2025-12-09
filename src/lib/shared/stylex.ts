import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';

export function stylexPropsWithClassName(stylexProps: Readonly<{
  className?: string,
  'data-style-src'?: string,
  style?: Readonly<{ [$$Key$$: string]: string | number }>
}>, ...inputs: ClassValue[]) {
  return {
    ...stylexProps,
    className: clsx(stylexProps.className, ...inputs)
  };
}

export function stylexPropsWithStyleObject(stylexProps: Readonly<{
  className?: string,
  'data-style-src'?: string,
  style?: Readonly<{ [$$Key$$: string]: string | number }>
}>, style: React.CSSProperties) {
  return {
    ...stylexProps,
    style: {
      ...stylexProps.style,
      ...style
    }
  };
}
