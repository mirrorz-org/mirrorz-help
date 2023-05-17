# mirrorz-help

[mirrors.help](https://mirrors.help) and [help.mirrors.cernet.edu.cn](https://help.mirrors.cernet.edu.cn)

## Get started

```bash
npm i
npm run dev
```

## Deploy

```bash
npm run og:build && npm run build && npm run export
```

### Ways to integrate mirrorz-help

1. link in the mirror frontend
   e.g. [ISCAS](https://mirror.iscas.ac.cn), [SJTUG](https://mirrors.sjtug.sjtu.edu.cn/) and [SDU](https://mirrors.sdu.edu.cn/index.html#/mirror)
2. link in the mirror help
   e.g. [NWAFU](https://mirrors.nwafu.edu.cn/help/local-repository/debian/)
3. Fork/Rebase and Transpile mdx to local markdown
   e.g. [TUNA/BFSU](https://github.com/tuna/mirrorz-help/blob/tuna/custom/tuna/transpile.sh)
4. Self-host
   e.g. [xtom.help](https://github.com/xtomcom/xtom.help)
5. Reverse proxy
   e.g. [NJU](https://mirror.nju.edu.cn/)
