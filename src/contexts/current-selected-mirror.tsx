import React, { createContext, useContext, useMemo, useState } from 'react';
import { noop } from '../lib/shared/util';
import { useMirrorZData } from '../hooks/use-mirrorz-data';
import { useRouter } from 'next/router';
import { sanitizeAbbrForMirrorZ } from '../lib/client/utils';
import { issueUrl } from '../lib/client/constant';
import { useSetDialog } from './dialog';
import ExternalLink from '../components/external-link';
import style9 from 'style9';
import useLayoutEffect from '../hooks/use-isomorphic-effect';

const styles = style9.create({
  link: {
    color: 'var(--text-link)',
    display: 'inline',
    borderBottomWidth: '1px',
    borderBottomColor: 'transparent',
    borderBottomStyle: 'solid',
    transitionDuration: '100ms',
    transitionProperty: 'color',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
    lineHeight: 1.5,
    ':hover': {
      borderBottomColor: 'var(--text-link)'
    }
  }
});

const SelectedMirrorContext = createContext<string | null>(null);
const SelectedMirrorDispatchContext = createContext<React.Dispatch<React.SetStateAction<string | null>>>(noop);

export const useSelectedMirror = () => useContext(SelectedMirrorContext);
export const useSetSelectedMirror = () => useContext(SelectedMirrorDispatchContext);

export const SelectedMirrorProvider = ({ children, cname }: React.PropsWithChildren<{ cname: string | null }>) => {
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
    if (select) {
      if (!validAbbrList.has(select)) {
        setInvalid(true);
        select = null;
      }
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
            <br />
            如果你有任何疑问，请通过 <ExternalLink href={issueUrl} className={styles('link')}>通过 GitHub Issue 向我们反馈这个问题</ExternalLink>。
          </>
        )
      });
    } else {
      setDialog(null);
    }
  }, [cname, invalid, router.query.mirror, setDialog]);

  return (
    <SelectedMirrorContext.Provider value={selectedMirror}>
      <SelectedMirrorDispatchContext.Provider value={setSelectedMirror}>
        {children}
      </SelectedMirrorDispatchContext.Provider>
    </SelectedMirrorContext.Provider>
  );
};
