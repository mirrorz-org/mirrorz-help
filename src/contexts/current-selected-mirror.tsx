import React, { createContext, useContext, useState } from 'react';
import { noop } from '../lib/shared/util';
import { useMirrorZData } from '../hooks/use-mirrorz-data';
import { useRouter } from 'next/router';
import { sanitizeAbbrForMirrorZ } from '../lib/client/utils';

const SelectedMirrorContext = createContext<string | null>(null);
const SelectedMirrorDispatchContext = createContext<React.Dispatch<React.SetStateAction<string | null>>>(noop);

export const useSelectedMirror = () => useContext(SelectedMirrorContext);
export const useSetSelectedMirror = () => useContext(SelectedMirrorDispatchContext);

export const SelectedMirrorProvider = ({ children, cname }: React.PropsWithChildren<{ cname: string | null }>) => {
  const [selectedMirror, setSelectedMirror] = useState<string | null>(null);
  const { data } = useMirrorZData();

  const router = useRouter();
  // When data is finally loaded, but there is no default mirror provided, we set the first mirror as default
  // TODO: use mirror from URL query when available
  if (data && cname && selectedMirror === null && router.isReady) {
    const select = sanitizeAbbrForMirrorZ(
      router.query.mirror as string | undefined
      || data[1][cname]?.[0].site.abbr
    );

    if (select) {
      setSelectedMirror(select);
    }
  }

  return (
    <SelectedMirrorContext.Provider value={selectedMirror}>
      <SelectedMirrorDispatchContext.Provider value={setSelectedMirror}>
        {children}
      </SelectedMirrorDispatchContext.Provider>
    </SelectedMirrorContext.Provider>
  );
};
