import React from 'react';
import style9 from 'style9';

const styles = style9.create({
  wrapper: {
    paddingLeft: 0
  },
  container: {
    paddingLeft: '20px',
    paddingRight: '20px',
    '@media screen and (min-width: 640px)': {
      paddingLeft: '48px',
      paddingRight: '48px'
    }
  },
  inner: {
    maxWidth: 1280,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

export default function DocumentationWrapper({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className={styles('wrapper')}>
      {/* {!isHomePage && (
          <PageHeading
            title={title}
            description={description}
            tags={route?.tags}
          />
        )} */}
      <div className={styles('container')}>
        <div className={styles('inner')}>
          {children}
        </div>
        {/* <DocsPageFooter
          route={route}
          nextRoute={nextRoute}
          prevRoute={prevRoute}
        /> */}
      </div>
    </div>
  );
}
