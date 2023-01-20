import { memo } from 'react';

function ExternalLink({ href, ...props }: JSX.IntrinsicElements['a']) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

export default memo(ExternalLink);
