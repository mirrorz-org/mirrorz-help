import style9 from 'style9';
import IconChevronUpDown from '@/components/icons/chevron-up-down';
import { memo, useCallback } from 'react';
import { useSelectedMirror, useSetSelectedMirror } from '@/contexts/current-selected-mirror';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { useCurrentCname } from '@/contexts/current-cname';

const styles = style9.create({
  select_wrapper: {
    flexGrow: 1,
    position: 'relative',
    marginLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)'
  },
  select: {
    width: '100%',
    display: 'inline-flex',
    paddingLeft: '8px',
    paddingRight: '22px',
    fontSize: '14px',
    height: '32px',
    cursor: 'pointer',
    appearance: 'none',
    lineHeight: 1.5,
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)'
  },
  icon_wrapper: {
    display: 'inline-flex',
    position: 'absolute',
    pointerEvents: 'none',
    color: 'var(--text-primary)',
    right: '4px'
  },
  icon: {
    width: '14px',
    height: '14px',
    '@media screen and (min-width: 840px)': {
      width: '16px',
      height: '16px'
    }
  }
});

function MirrorSelectMenu() {
  const selectedMirror = useSelectedMirror();
  const setSelectedMirror = useSetSelectedMirror();

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    setSelectedMirror(e.target.value);
  }, [setSelectedMirror]);

  const cname = useCurrentCname();
  const { isLoading, data } = useMirrorZData();

  return (
    <div className={styles('select_wrapper')}>
      <select
        className={styles('select')}
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
      <span className={styles('icon_wrapper')}>
        <IconChevronUpDown className={styles('icon')} />
      </span>
    </div>
  );
}

export default memo(MirrorSelectMenu);
