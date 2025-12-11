import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
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
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
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
    width: {
      default: '14px',
      '@media (min-width: 840px)': '16px'
    },
    height: {
      default: '14px',
      '@media (min-width: 840px)': '16px'
    }
  }
});

export const selectWrapperXStyle = styles.select_wrapper;
export const selectXStyle = styles.select;
export const iconWrapperXStyle = styles.icon_wrapper;
export const iconXStyle = styles.icon;
