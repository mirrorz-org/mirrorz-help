import { useId } from 'react';
import style9 from 'style9';

const styles = style9.create({
  wrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    columnGap: '12px',
    rowGap: '12px'
  },
  sr_only: {
    height: 0,
    width: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    padding: 0,
    margin: 0,
    clipPath: 'inset(50%)',
    position: 'absolute'
  },
  track: {
    display: 'block',
    pointerEvents: 'auto',
    height: '24px',
    width: '40px',
    borderRadius: '999px',
    padding: '4px',
    transitionProperty: 'color, background-color, border-color, fill, stroke, opacity, box-shadow, transform',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '100ms'
  },
  track_inactive: {
    backgroundColor: 'var(--bg-switch)',
    boxShadow: 'inset 0 0 0 calc(1px + 0) var(--bg-highlight)'
  },
  track_active: {
    backgroundColor: 'var(--bg-primary)',
    boxShadow: 'inset 0 0 0 calc(1px + 0) var(--bg-primary)'
  },
  thumb: {
    height: '16px',
    width: '16px',
    borderRadius: '999px',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 0 0 calc(1px + 0) var(--bg-secondary), var(--shadow-main)',
    transitionProperty: 'color, background-color, border-color, fill, stroke, opacity, box-shadow, transform',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '100ms'
  },
  thumb_active: {
    transform: 'translateX(16px)'
  }
});

interface SwitchProps {
  checked: boolean,
  onChange: () => void,
  label?: string
}

export default function Switch({
  checked = true,
  onChange,
  label
}: SwitchProps) {
  const id = useId();

  return (
    <div className={styles('wrapper')}>
      <label htmlFor={id} className="mantine-1ld5t9y mantine-Switch-label">
        {label}
      </label>
      <input onChange={onChange} id={id} type="checkbox" className={styles('sr_only')} />
      <label htmlFor={id} className={styles('track', checked ? 'track_active' : 'track_inactive')}>
        <div className={styles('thumb', checked && 'thumb_active')} />
      </label>
    </div>
  );
}
