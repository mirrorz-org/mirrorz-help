import style9 from 'style9';
import IconChevronUpDown from '@/components/icons/chevron-up-down';
import { iconWrapperXStyle, iconXStyle, selectWrapperXStyle, selectXStyle } from './select-style';
import { memo, useCallback } from 'react';
import { useMirrorHttpsEnabled, useSetMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';

function HttpsSelectMenu() {
  const httpsEnabled = useMirrorHttpsEnabled();
  const setHttpsEnabled = useSetMirrorHttpsEnabled();

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    if (e.currentTarget.value === '1') {
      setHttpsEnabled(true);
    } else if (e.currentTarget.value === '0') {
      setHttpsEnabled(false);
    }
  }, [setHttpsEnabled]);

  return (
    <div className={style9(selectWrapperXStyle)}>
      <select
        className={style9(selectXStyle)}
        value={httpsEnabled ? '1' : '0'}
        onChange={handleChange}
      >
        <option value="1">HTTPS (https://)</option>
        <option value="0">HTTP (http://)</option>
      </select>
      <span className={style9(iconWrapperXStyle)}>
        <IconChevronUpDown className={style9(iconXStyle)} />
      </span>
    </div>
  );
}

export default memo(HttpsSelectMenu);
