import style9 from 'style9';

import { useRouteMeta } from '@/hooks/use-route-meta';
import ExternalLink from '../external-link';
import { useMemo, useState } from 'react';
import useLayoutEffect from '@/hooks/use-isomorphic-effect';

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
    marginBottom: '16px',
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

const LastUpdated = ({ time }: { time: number | Date }) => {
  const date = useMemo(() => (typeof time === 'number' ? new Date(time) : time), [time]);
  const isoString = useMemo(() => date.toISOString(), [date]);
  const [timeString, setTimeString] = useState(isoString);

  useLayoutEffect(() => {
    setTimeString(date.toLocaleString('zh-CN'));
  }, [date]);

  return (
    <time dateTime={isoString}>{timeString}</time>
  );
};

interface MetadataCardProps {
  lastupdate?: number | undefined
}

export default function MetadataCard({ lastupdate }: MetadataCardProps) {
  const meta = useRouteMeta();

  if (!meta) return null;
  return (
    <div className={styles('main')}>
      {/** TODO: only enable in production when we migrate to GitHub Actions (full clone required) */}
      {process.env.NODE_ENV !== 'production' && lastupdate && (
        <p className={styles('p')}>
          <span className={styles('bold')}>本页面最近更新于</span>
          {' '}
          <LastUpdated time={lastupdate} />
        </p>
      )}
      <p className={styles('p')}>
        <span className={styles('bold')}>这个页面的内容有问题？</span>
        <ExternalLink href="#" className={styles('link')}>
          {/** TODO: GitHub Issue URL builder, GitHub Issue Template */}
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
