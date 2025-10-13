import { createContext, use, useMemo, useState } from 'react';
import { noop } from 'foxact/noop';
import { useMirrorZData } from '../hooks/use-mirrorz-data';
import { useRouter } from 'next/router';
import { sanitizeAbbrForMirrorZ } from '../lib/client/utils';
import { useSetDialog } from './dialog';
import { useLayoutEffect } from 'foxact/use-isomorphic-layout-effect';

// const styles = stylex.create({
//   link: {
//     color: 'var(--text-link)',
//     display: 'inline',
//     borderBottomWidth: '1px',
//     borderBottomColor: {
//       default: 'transparent',
//       ':hover': 'var(--text-link)'
//     },
//     borderBottomStyle: 'solid',
//     transitionDuration: '100ms',
//     transitionProperty: 'color',
//     transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
//     lineHeight: 1.5
//   }
// });

const SelectedMirrorContext = createContext<string | null>(null);
const SelectedMirrorDispatchContext = createContext<React.Dispatch<React.SetStateAction<string | null>>>(noop);

export const useSelectedMirror = () => use(SelectedMirrorContext);
export const useSetSelectedMirror = () => use(SelectedMirrorDispatchContext);

export function SelectedMirrorProvider({ children, cname }: React.PropsWithChildren<{ cname: string | null }>) {
  const [selectedMirror, setSelectedMirror] = useState<string | null>(null);
  const setDialog = useSetDialog();
  const [invalid, setInvalid] = useState(false);
  const { data } = useMirrorZData();

  const validAbbrList = useMemo(() => {
    if (data && cname) {
      return new Set(data[1][cname].map(m => sanitizeAbbrForMirrorZ(m.site.abbr)));
    }
    return new Set<string>();
  }, [cname, data]);

  const router = useRouter();
  // When data is finally loaded, but there is no default mirror provided, we set the first mirror as default
  // TODO: use mirror from URL query when available
  if (data && cname && selectedMirror === null && router.isReady) {
    const mirrorFromUrlQuery = router.query.mirror;
    let select = typeof mirrorFromUrlQuery === 'string' ? sanitizeAbbrForMirrorZ(mirrorFromUrlQuery) : null;
    if (select && !validAbbrList.has(select)) {
      setInvalid(true);
      select = null;
    }
    if (!select) {
      select = sanitizeAbbrForMirrorZ(data[1][cname][0].site.abbr);
    }
    setSelectedMirror(select);
  }

  useLayoutEffect(() => {
    if (invalid && cname && router.query.mirror) {
      setDialog({
        title: '提示',
        content: (
          <>
            您当前试图使用 {router.query.mirror} 镜像站，但是该镜像站似乎并没有提供 {cname} 的镜像。
          </>
        )
      });
    } else {
      setDialog(null);
    }
  }, [cname, invalid, router.query.mirror, setDialog]);

  return (
    <SelectedMirrorContext value={selectedMirror}>
      <SelectedMirrorDispatchContext value={setSelectedMirror}>
        {children}
      </SelectedMirrorDispatchContext>
    </SelectedMirrorContext>
  );
}
