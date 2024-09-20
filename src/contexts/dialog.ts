import { createContextState } from 'foxact/context-state';

export interface DialogParams {
  title?: string,
  content?: React.ReactNode
}

const [DialogProvider, useDialog, useSetDialog] = createContextState<DialogParams | null>(null);

export { DialogProvider, useDialog, useSetDialog };
