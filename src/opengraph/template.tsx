// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- required for satori & resvg
import React from 'react';

interface ContentProps {
  siteName?: string,
  titleLine1: string,
  titleLine2?: string,
  domain?: string,
  path: string
}

export function Content({
  siteName = 'MirrorZ Help',
  titleLine1,
  titleLine2,
  domain = 'help.mirrorz.org',
  path
}: ContentProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#18181b',
        backgroundImage: 'radial-gradient(circle at 25px 25px, #1f2937 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1f2937 2%, transparent 0%)',
        backgroundSize: '100px 100px'
      }}
    >
      <div
        style={{
          left: 72,
          top: 72,
          position: 'absolute',
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{}} width={48} height={48} version="1.1" viewBox="0 0 2279 2279">
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
        <span style={{ marginLeft: 16, fontSize: 32, fontFamily: 'NotoSans SC', fontWeight: 700 }} lang="zh-CN">
          {siteName}
        </span>
      </div>
      <div
        lang="zh-CN"
        style={{
          left: 72,
          bottom: 72,
          position: 'absolute',
          display: 'flex',
          color: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'column'
        }}
      >
        <div lang="zh-CN" style={{ fontSize: 56, lineHeight: 1.5, fontFamily: 'NotoSans SC', fontWeight: 700 }}>
          {titleLine1}
        </div>
        {
          titleLine2 && (
            <div lang="zh-CN" style={{ fontSize: 56, lineHeight: 1.5, fontFamily: 'NotoSans SC', fontWeight: 700 }}>
              {titleLine2}
            </div>
          )
        }
      </div>
      <div
        style={{
          right: 72,
          bottom: 72,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: '#a1a1aa',
            fontWeight: 500,
            fontSize: 24
          }}
        >
          https://
        </span>
        <span
          style={{
            marginLeft: 1,
            fontWeight: 500,
            fontSize: 24,
            color: 'white'
          }}
        >
          {domain}
        </span>
        <span
          style={{
            marginLeft: 1,
            fontWeight: 500,
            fontSize: 24,
            color: '#a1a1aa'
          }}
        >
          {path}
        </span>
      </div>
    </div>
  );
}

interface DefaultProps {
  siteName: string,
  domain: string
}

export function Default({ siteName, domain }: DefaultProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#18181b'
      }}
    >
      <div
        style={{
          right: 64,
          bottom: 64,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            fontWeight: 500,
            color: '#a1a1aa',
            fontSize: 28
          }}
        >
          https://
        </span>
        <span
          style={{
            marginLeft: 1,
            fontSize: 28,
            fontWeight: 500,
            color: 'white'
          }}
        >
          {domain}
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
        lang="zh-CN"
        style={{
          display: 'flex',
          fontSize: 64,
          fontFamily: 'NotoSans SC',
          color: 'white',
          fontWeight: 700,
          marginLeft: 24,
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap'
        }}
      >
        {siteName}
      </div>
    </div>
  );
}
