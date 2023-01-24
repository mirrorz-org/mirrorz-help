import style9 from 'style9';
import MirrorSelectMenu from './mirror-select-menu';
import { memo } from 'react';
import HttpsSelectMenu from './https-select-menu';
import { useFrontMatters } from '../../../contexts/current-frontmatters';

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
    flexWrap: 'wrap',
    alignItems: 'center',
    // @ts-expect-error -- gap is known property
    gap: '12px'
  }
});

function MetaCard() {
  const { disable_https_select = false } = useFrontMatters();
  return (
    <div className={styles('main')}>
      <div className={styles('menu_wrapper')}>
        <p>选择镜像</p>
        <MirrorSelectMenu />
      </div>
      {
        (disable_https_select !== true) && (
          <div className={styles('menu_wrapper')}>
            <p>是否启用 HTTPS</p>
            <HttpsSelectMenu />
          </div>
        )
      }
    </div>
  );
}

export default memo(MetaCard);
