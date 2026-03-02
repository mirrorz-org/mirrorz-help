import type { MenuValue } from '@/components/mdx-components/enhanced-codeblock/menus';
import { createContextState } from 'foxact/context-state';

const [PageGlobalVariableProvider, usePageGlobalVariable, useSetPageGlobalVariable] = createContextState<Record<string, MenuValue>>();

export { PageGlobalVariableProvider, usePageGlobalVariable, useSetPageGlobalVariable };
