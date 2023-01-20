import style9 from 'style9';
import MirrorSelectMenu from './mirror-select-menu';

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
    marginBottom: '24px'
  },
  menu_wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  }
});

export default function MetaCard() {
  return (
    <div
      className={styles('main')}
    >
      <div className={styles('menu_wrapper')}>
        <p>选择镜像</p>
        <MirrorSelectMenu />
      </div>
    </div>
  );
}
