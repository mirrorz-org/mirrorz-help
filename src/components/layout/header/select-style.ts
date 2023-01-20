import style9 from 'style9';

const styles = style9.create({
  select_wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)',
    flexGrow: 1
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

export const selectWrapperXStyle = styles.select_wrapper;
export const selectXStyle = styles.select;
export const iconWrapperXStyle = styles.icon_wrapper;
export const iconXStyle = styles.icon;
