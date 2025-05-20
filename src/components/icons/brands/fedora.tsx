import { memo } from 'react';

function IconFedora(p: React.JSX.IntrinsicElements['svg']) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...p}><path fill="#294172" d="M64 32a32 32 0 0 0-64 0v24.7c0 4 3.3 7.3 7.3 7.3H32a32 32 0 0 0 32-32z" /><path fill="#3c6eb4" d="M41.4 7.6a15 15 0 0 0-15 15v8h-8a15 15 0 1 0 15 15v-8h8a15 15 0 1 0 0-30zm-15 38a8 8 0 0 1-16 0 8 8 0 0 1 8-8h6.9c.6 0 1 .5 1 1v7zm15-15h-6.8c-.6 0-1.1-.5-1.1-1.2v-6.8a8 8 0 1 1 7.9 8z" /><path fill="#fff" d="M26.4 30.6v-8A15 15 0 0 1 44.7 8c1.7.5 3.1 1.9 3.1 3.5 0 2-1.4 3.4-3.5 3.4-1 0-1.4-.2-3-.2a8 8 0 0 0-7.8 7.9v6.8c0 .7.5 1.2 1 1.2h5.3a3.5 3.5 0 1 1 0 7h-6.3v8A15 15 0 0 1 15 60c-1.7-.4-3-1.8-3-3.4 0-2 1.4-3.4 3.5-3.4l2.8.2a8 8 0 0 0 8-8v-6.8c0-.6-.5-1.1-1.1-1.1H20a3.5 3.5 0 1 1 0-7h6.4z" /></svg>;
}

export default memo(IconFedora);
