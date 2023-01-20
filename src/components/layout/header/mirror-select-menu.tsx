import style9 from 'style9';
import IconChevronUpDown from '@/components/icons/chevron-up-down';
import { memo, useCallback } from 'react';
import { useSelectedMirror, useSetSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';
import { iconWrapperXStyle, selectWrapperXStyle, selectXStyle, iconXStyle } from './select-style';

function MirrorSelectMenu() {
  const selectedMirror = useSelectedMirror();
  const setSelectedMirror = useSetSelectedMirror();

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    setSelectedMirror(e.target.value);
  }, [setSelectedMirror]);

  const cname = useCurrentCname();
  const { isLoading, data } = useMirrorZData();

  return (
    <div className={style9(selectWrapperXStyle)}>
      <select
        className={style9(selectXStyle)}
        value={selectedMirror || undefined}
        onChange={handleChange}
        disabled={isLoading}
      >
        {
          isLoading
            ? <option value="">Loading...</option>
            : (
              data?.[1][cname].map(mirror => {
                const siteName = mirror.site.name ? `${mirror.site.abbr} - ${mirror.site.name}` : mirror.site.abbr;
                return (
                  <option key={mirror.baseUrl} value={mirror.site.abbr}>{siteName}</option>
                );
              })
            )
        }
      </select>
      <span className={style9(iconWrapperXStyle)}>
        <IconChevronUpDown className={style9(iconXStyle)} />
      </span>
    </div>
  );
}

export default memo(MirrorSelectMenu);
