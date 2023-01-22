import React from 'react';
import style9 from 'style9';

import articleStyles from '@/styles/article/article.module.sass';
import hljsStyles from '@/styles/highlight/hljs.module.sass';
import clsx from 'clsx';

const styles = style9.create({
  inner: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

export default function DocumentationWrapper({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className={clsx(styles('inner'), articleStyles.article, hljsStyles.hljs_container)}>
      {children}
    </div>
  );
}
