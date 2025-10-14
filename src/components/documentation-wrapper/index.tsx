import articleStyles from '@/styles/article/article.module.sass';
import hljsStyles from '@/styles/highlight/hljs.module.sass';
import { clsx } from 'clsx';

export default function DocumentationWrapper({ children }: React.PropsWithChildren) {
  return (
    <article className={clsx(articleStyles.article, hljsStyles.hljs_container)}>
      {children}
    </article>
  );
}
