import { memo } from 'react';

function MirrorZLogo(props: React.JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="ISO" version="1.1" viewBox="0 0 2279 2279" {...props}>
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
  );
}

export default memo(MirrorZLogo);
