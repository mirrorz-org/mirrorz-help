import { createContextState } from 'foxact/context-state';

const [MirrorEnableSudoProvider, useMirrorSudoEnabled, useSetMirrorSudoEnabled] = createContextState(true);

export { MirrorEnableSudoProvider, useMirrorSudoEnabled, useSetMirrorSudoEnabled };
