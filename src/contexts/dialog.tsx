import { createContext, useContext, useState } from 'react';
import { noop } from '../lib/shared/util';

export interface DialogParams {
  title?: string;
  content?: React.ReactNode;
}

const DialogContext = createContext<DialogParams | null>(null);
const DialogDispatchContext = createContext<React.Dispatch<React.SetStateAction<DialogParams | null>>>(noop);

export const useDialog = () => useContext(DialogContext);
export const useSetDialog = () => useContext(DialogDispatchContext);

export const DialogProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [dialog, setDialog] = useState<DialogParams | null>(null);
  return (
    <DialogContext.Provider value={dialog}>
      <DialogDispatchContext.Provider value={setDialog}>
        {children}
      </DialogDispatchContext.Provider>
    </DialogContext.Provider>
  );
};
