import { useEffect } from 'react';
import { useSearchOpen, useSetSearchOpen } from '../contexts/search';

function isEditingContent(event: KeyboardEvent) {
  const element = event.target as HTMLElement | null;
  const tagName = element?.tagName;
  return (
    (element && 'isContentEditable' in element && element.isContentEditable)
    || tagName === 'INPUT'
    || tagName === 'SELECT'
    || tagName === 'TEXTAREA'
  );
}

export function useSearchHotKeys() {
  const isOpen = useSearchOpen();
  const setOpen = useSetSearchOpen();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        (event.keyCode === 27 && isOpen)
        || (event.key === 'k' && (event.metaKey || event.ctrlKey))
        || (!isEditingContent(event) && event.key === '/' && !isOpen)
      ) {
        event.preventDefault();
        setOpen(isOpen => !isOpen);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, setOpen]);
}
