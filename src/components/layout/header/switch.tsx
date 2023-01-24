import { memo, useCallback } from 'react';
import { useMirrorHttpsEnabled, useSetMirrorHttpsEnabled } from '@/contexts/mirror-enable-https';
import CheckBox from '../../form/checkbox';
import { useMirrorSudoEnabled, useSetMirrorSudoEnabled } from '@/contexts/mirror-enable-sudo';

export const HttpsSwitch = memo(() => {
  const httpsEnabled = useMirrorHttpsEnabled();
  const setHttpsEnabled = useSetMirrorHttpsEnabled();

  const handleChange = useCallback(() => {
    setHttpsEnabled(i => !i);
  }, [setHttpsEnabled]);

  return (
    <CheckBox checked={httpsEnabled} onChange={handleChange} label="是否启用 HTTPS" />
  );
});

export const SudoSwitch = memo(() => {
  const httpsEnabled = useMirrorSudoEnabled();
  const setHttpsEnabled = useSetMirrorSudoEnabled();

  const handleChange = useCallback(() => {
    setHttpsEnabled(i => !i);
  }, [setHttpsEnabled]);

  return (
    <CheckBox checked={httpsEnabled} onChange={handleChange} label="是否使用 sudo" />
  );
});
