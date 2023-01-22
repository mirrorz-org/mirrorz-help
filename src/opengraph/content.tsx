interface ContentProps {
  siteName?: string;
  title: string;
  domain?: string;
  path: string;
}

export const Content = ({
  siteName = 'MirrorZ Help',
  title,
  domain = 'help.mirrorz.org',
  path
}: ContentProps) => {
  const mainTitle = title.split('镜像使用帮助');
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-.02em',
        fontWeight: 700,
        background: '#18181b',
        backgroundImage: 'radial-gradient(circle at 25px 25px, #1f2937 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1f2937 2%, transparent 0%)',
        backgroundSize: '100px 100px'
      }}
    >
      <div
        style={{
          left: 42,
          top: 42,
          fontSize: 24,
          position: 'absolute',
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{}} width={32} height={32} version="1.1" viewBox="0 0 2279 2279">
          <defs id="defs4" />
          <g id="g856" transform="matrix(1.84846 -1.7267 -.30318 1.41287 -625 1495)">
            <circle id="circle8" cx="1139.6" cy="1139.6" r="433.7" fill="#19b5fe" strokeWidth=".4" />
            <circle id="circle14" cx="1396.1" cy="805.3" r="180.1" strokeWidth=".4" fill="#fff" transform="rotate(15)" />
            <circle id="circle16" cx="1396.1" cy="805.3" r="168.4" fill="#bee2e9" strokeWidth=".4" transform="rotate(15)" />
            <circle id="circle18" cx="1396.1" cy="805.3" r="65.2" strokeWidth=".4" fill="#fff" transform="rotate(15)" />
          </g>
          <path id="path9198" strokeWidth="2.2" d="M2271 255s-229 139-410 189c-181 51-455 89-728 10s-535-102-741-67C185 422 1 487 1 487s288-212 541-331S1136-6 1412 15c261 21 634 170 859 240Z" fill="#815cb7" />
          <path id="path850" strokeWidth="2.2" d="M1 2017s229-139 410-189c181-51 455-89 728-11 273 79 535 102 741 67 207-35 391-99 391-99s-289 212-541 331a1841 1841 0 0 1-870 141c-261-21-634-170-859-240Z" fill="#815cb7" />
        </svg>
        <span style={{ marginLeft: 12 }}>
          {siteName}
        </span>
      </div>
      <div
        lang="zh-CN"
        style={{
          fontSize: 40,
          left: 42,
          bottom: 42,
          position: 'absolute',
          display: 'flex',
          color: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'column'
        }}
      >
        <div>
          {mainTitle[0]}
        </div>
        <div>
          镜像使用帮助
        </div>
      </div>
      <div
        style={{
          right: 42,
          bottom: 42,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: '#a1a1aa',
            fontSize: 18
          }}
        >
          https://
        </span>
        <span
          style={{
            marginLeft: 2,
            fontSize: 20,
            color: 'white'
          }}
        >
          {domain}
        </span>
        <span
          style={{
            marginLeft: 2,
            fontSize: 18,
            color: '#a1a1aa'
          }}
        >
          {path}
        </span>
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-.02em',
        fontWeight: 700,
        background: '#18181b'
      }}
    >
      <div
        style={{
          right: 42,
          bottom: 42,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: '#a1a1aa',
            fontSize: 22
          }}
        >
          https://
        </span>
        <span
          style={{
            marginLeft: 1,
            fontSize: 22,
            color: 'white'
          }}
        >
          help.mirrorz.org
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} version="1.1" viewBox="0 0 2279 2279">
            <defs id="defs4" />
            <g id="g856" transform="matrix(1.84846 -1.7267 -.30318 1.41287 -625 1495)">
              <circle id="circle8" cx="1139.6" cy="1139.6" r="433.7" fill="#19b5fe" strokeWidth=".4" />
              <circle id="circle14" cx="1396.1" cy="805.3" r="180.1" strokeWidth=".4" fill="#fff" transform="rotate(15)" />
              <circle id="circle16" cx="1396.1" cy="805.3" r="168.4" fill="#bee2e9" strokeWidth=".4" transform="rotate(15)" />
              <circle id="circle18" cx="1396.1" cy="805.3" r="65.2" strokeWidth=".4" fill="#fff" transform="rotate(15)" />
            </g>
            <path id="path9198" strokeWidth="2.2" d="M2271 255s-229 139-410 189c-181 51-455 89-728 10s-535-102-741-67C185 422 1 487 1 487s288-212 541-331S1136-6 1412 15c261 21 634 170 859 240Z" fill="#815cb7" />
            <path id="path850" strokeWidth="2.2" d="M1 2017s229-139 410-189c181-51 455-89 728-11 273 79 535 102 741 67 207-35 391-99 391-99s-289 212-541 331a1841 1841 0 0 1-870 141c-261-21-634-170-859-240Z" fill="#815cb7" />
          </svg>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 54,
          fontStyle: 'normal',
          color: 'white',
          marginLeft: 24,
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap'
        }}
      >
        <b>MirrorZ Help</b>
      </div>
    </div>
  );
};
