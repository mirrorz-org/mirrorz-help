import { memo, useCallback } from 'react';
import { useMirrorHttpsEnabled, useSetMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import CheckBox from '../../form/checkbox';

function HttpsCheckBox() {
  const httpsEnabled = useMirrorHttpsEnabled();
  const setHttpsEnabled = useSetMirrorHttpsEnabled();

  const handleChange = useCallback(() => {
    setHttpsEnabled(i => !i);
  }, [setHttpsEnabled]);

  return (
    <CheckBox checked={httpsEnabled} onChange={handleChange} label="是否启用 HTTPS" />
  );
}

export default memo(HttpsCheckBox);
