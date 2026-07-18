import { Children, memo } from 'react';
import type { ReactNode } from 'react';
import { useSelectedMirror } from '@/contexts/current-selected-mirror';

const DEFAULT_VARIANT = '__default__';

interface MirrorVariantProps {
  children: ReactNode,
  site: string
}

interface MirrorBlockProps {
  children: ReactNode
}

function getVariantSite(node: ReactNode): string | undefined {
  if (typeof node === 'object' && node !== null && 'props' in node) {
    return (node as { props: { site?: string } }).props.site;
  }
  return undefined;
}

function MirrorBlock({ children }: MirrorBlockProps): ReactNode {
  const selectedMirror = useSelectedMirror();
  const variants = Children.toArray(children);

  return variants.find(v => getVariantSite(v) === selectedMirror)
    ?? variants.find(v => getVariantSite(v) === DEFAULT_VARIANT)
    ?? null;
}

function MirrorVariant({ children }: MirrorVariantProps): ReactNode {
  return children;
}

export default memo(MirrorBlock);
export { MirrorVariant };
