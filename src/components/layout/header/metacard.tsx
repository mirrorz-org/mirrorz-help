import style9 from 'style9';
import MirrorSelectMenu from './mirror-select-menu';
import { memo } from 'react';
import { HttpsSwitch, SudoSwitch } from './switch';
import { useFrontMatters } from '@/contexts/current-frontmatters';

const styles = style9.create({
  main: {
    padding: '24px',
    '@media screen and (min-width: 1280px)': {
      padding: '32px'
    },
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    // @ts-expect-error -- gap is known property
    gap: '24px'
  },
  menu_wrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    // @ts-expect-error -- gap is known property
    gap: '12px'
  },
  menu_title: {
    flex: '1'
  },
  switch_wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '24px',
    alignItems: 'center',
    columnGap: '24px'
    // '@media screen and (min-width: 768px)': {
    //   gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    // }
  }
});

function MetaCard() {
  const { disable_https_select = false } = useFrontMatters();
  return (
    <div className={styles('main')}>
      <div className={styles('menu_wrapper')}>
        <p className={styles('menu_title')}>选择镜像</p>
        <MirrorSelectMenu />
      </div>
      <div className={styles('switch_wrapper')}>
        {(disable_https_select !== true) && (<HttpsSwitch />)}
        <SudoSwitch />
      </div>
    </div>
  );
}

export default memo(MetaCard);
