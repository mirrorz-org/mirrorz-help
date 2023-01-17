import type React from 'react';
import { forwardRef } from 'react';

export type HTMLElementFromReactHTML<E> = E extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[E] : any;

interface TypeScriptHappyForwardRef {
  // eslint-disable-next-line @typescript-eslint/ban-types -- I just use it
  <T, P = {}>(
    render: (props: P, ref: React.ForwardedRef<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export const typescriptHappyForwardRef = forwardRef as TypeScriptHappyForwardRef;
