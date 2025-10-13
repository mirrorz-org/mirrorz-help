import { createContextState } from 'foxact/context-state';

export interface DialogParams {
  title?: string,
  content?: React.ReactNode
}

export const [DialogProvider, useDialog, useSetDialog] = createContextState<DialogParams | null>(null);
