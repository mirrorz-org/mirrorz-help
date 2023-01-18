import { useCallback, useEffect } from 'react';
import { useSearchOpen, useSetSearchOpen } from '../contexts/search';

const isEditingContent = (event: KeyboardEvent) => {
  const element = event.target as HTMLElement | null;
  const tagName = element?.tagName;
  return (
    (element && 'isContentEditable' in element && element.isContentEditable)
    || tagName === 'INPUT'
    || tagName === 'SELECT'
    || tagName === 'TEXTAREA'
  );
};

export const useSearchHotKeys = () => {
  const isOpen = useSearchOpen();
  const setOpen = useSetSearchOpen();

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        // eslint-disable-next-line @fluffyfox/browser/prefer-keyboard-event-key -- Esc on both macOS & Windows
        (event.keyCode === 27 && isOpen)
        || (event.key === 'k' && (event.metaKey || event.ctrlKey))
        || (!isEditingContent(event) && event.key === '/' && !isOpen)
      ) {
        event.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return function () {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, handleOpen, handleClose]);
};
