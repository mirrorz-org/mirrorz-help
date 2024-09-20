import { memo, useCallback } from 'react';
import { useDialog, useSetDialog } from '@/contexts/dialog';
import IconClose from '../icons/close';

import {
  Root as RadixDialogRoot,
  Portal as RadixDialogPortal,
  Overlay as RadixDialogOverlay,
  Content as RadixDialogContent,
  Title as RadixDialogTitle,
  Close as RadixDialogClose,
  Description as RadixDialogDescription
} from '@radix-ui/react-dialog';
import style9 from 'style9';

const styles = style9.create({
  close_button: {
    borderRadius: '100%',
    height: '25px',
    width: '25px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
    position: 'absolute',
    top: '10px',
    right: '10px'
  },
  overlay: {
    position: 'fixed',
    backgroundColor: 'var(--overlay)',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0',
    zIndex: 100,
    backdropFilter: 'blur(4px)'
  },
  root: {
    maxWidth: '640px',
    width: '100%',
    overflow: 'hidden',
    padding: 0
  },
  dialog: {
    zIndex: 101,
    borderRadius: '6px',
    boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '450px',
    maxHeight: '85vh',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    '@media screen and (min-width: 640px)': {
      transform: 'translateX(-50%) translateY(0)',
      width: '640px',
      height: 'auto',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px'
    },
    padding: '25px',
    backgroundColor: 'var(--bg-wash)',
    overflow: 'hidden',
    transformOrigin: '50%',
    outline: '0'
  },
  title: {
    fontWeight: 500,
    color: 'var(--text-primary)',
    fontSize: 18
  },
  description: {
    margin: '10px 0 20px',
    fontSize: 15,
    lineHeight: 1.5
  }
});

function Dialog() {
  const dialog = useDialog();
  const setDialog = useSetDialog();
  // const handleClose = useCallback(() => setDialog(null), [setDialog]);
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDialog(null);
    }
  }, [setDialog]);

  return (
    <RadixDialogRoot open={dialog !== null} onOpenChange={handleOpenChange}>
      <RadixDialogPortal>
        <RadixDialogOverlay className={styles('overlay')} />
        <RadixDialogContent className={styles('dialog')}>
          {dialog?.title && <RadixDialogTitle className={styles('title')}>{dialog.title}</RadixDialogTitle>}
          {dialog?.content != null && (
            <RadixDialogDescription className={styles('description')}>
              {dialog.content}
            </RadixDialogDescription>
          )}
          <RadixDialogClose asChild>
            <button className={styles('close_button')} aria-label="Close" type="button">
              <IconClose />
            </button>
          </RadixDialogClose>
        </RadixDialogContent>
      </RadixDialogPortal>
    </RadixDialogRoot>
  );
}

export default memo(Dialog);
