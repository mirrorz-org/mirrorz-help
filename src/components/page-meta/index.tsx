import style9 from 'style9';

import { useRouteMeta } from '@/hooks/use-route-meta';
import ExternalLink from '../external-link';
import { issueUrl } from '@/lib/client/constant';

const styles = style9.create({
  main: {
    padding: '20px 24px',
    '@media screen and (min-width: 1280px)': {
      padding: '28px 32px'
    },
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    marginTop: '36px',
    marginBottom: '24px'
  },
  p: {
    marginBottom: '20px',
    ':last-of-type': {
      marginBottom: 0
    }
  },
  link: {
    color: 'var(--text-link)',
    borderBottomWidth: '1px',
    borderBottomColor: 'transparent',
    borderBottomStyle: 'solid',
    ':hover': {
      borderBottomColor: 'var(--text-link)'
    }
  },
  bold: {
    fontWeight: 700
  }
});

export default function MetadataCard() {
  const meta = useRouteMeta();

  if (!meta) return null;
  return (
    <div className={styles('main')}>
      <p className={styles('p')}>
        <span className={styles('bold')}>这个页面的内容有问题？</span>
        <ExternalLink href={issueUrl} className={styles('link')}>
          在 GitHub Issue 反馈
        </ExternalLink>
      </p>
      {/** TODO: Contributing Guide */}
      <p className={styles('p')}>
        <span className={styles('bold')}>想完善这个页面？</span>
        <ExternalLink className={styles('link')} href="#">
          查看我们的贡献指南
        </ExternalLink>，
        <ExternalLink className={styles('link')} href={`https://github.com/mirrorz-org/mirrorz-help/blob/master/contents/${meta.file}`}>
          在 GitHub 上查看此页的源代码
        </ExternalLink>
      </p>
      <p className={styles('p')}>
        <span className={styles('bold')}>
          本页面的全部内容在
          {' '}
          <ExternalLink href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed" className={styles('link')}>
            CC BY-NC-SA 4.0
          </ExternalLink>
          {' '}
          协议之条款下提供，附加条款亦可能应用。
        </span>
      </p>
    </div>
  );
}
