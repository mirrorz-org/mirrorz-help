import { createContextState } from 'foxact/context-state';

const [MirrorEnableHttpsProvider, useMirrorHttpsEnabled, useSetMirrorHttpsEnabled] = createContextState(true);

export { MirrorEnableHttpsProvider, useMirrorHttpsEnabled, useSetMirrorHttpsEnabled };
