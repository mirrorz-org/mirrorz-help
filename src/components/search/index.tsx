import style9 from 'style9';
import IconSearch from '../icons/search';
import Input from '../input';

const styles = style9.create({
  icon: {
    position: 'absolute',
    width: '26px',
    height: '14px',
    marginTop: '6px',
    marginBottom: '6px',
    userSelect: 'none',
    left: '4px',
    paddingLeft: '6px',
    paddingRight: '6px',
    alignItems: 'center',
    pointerEvents: 'none',
    display: 'flex',
    color: 'var(--text-shallow)'
  },
  input: {
    paddingLeft: '30px'
  }
});

const inputXstyle = [styles.input];
export default function Search() {
  return (
    <Input
      placeholder="Quick Search"
      inputXstyle={inputXstyle}
      // @ts-expect-error -- fuck @types/react, what a piece of junk
      prefix={(
        <IconSearch className={styles('icon')} />
      )}
    />
  );
}
