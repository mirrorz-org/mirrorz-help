### 将 bucket 切换至镜像

以下 7 个官方 bucket 在南大和上科大均可使用，且仓库路径一致。配置 games、nerd-fonts 或 sysinternals 前，请先在页面中选择具体镜像站，并查看该站的说明。

以 main 为例，先移除再重新添加指向镜像的 bucket：

```{ztmpl lang="powershell"}
scoop bucket rm main
scoop bucket add main "{{endpoint}}/main.git"
```

其余支持的官方 bucket 同理：

```{ztmpl lang="powershell"}
scoop bucket rm extras
scoop bucket add extras "{{endpoint}}/extras.git"
scoop bucket rm versions
scoop bucket add versions "{{endpoint}}/versions.git"
scoop bucket rm nirsoft
scoop bucket add nirsoft "{{endpoint}}/nirsoft.git"
scoop bucket rm php
scoop bucket add php "{{endpoint}}/php.git"
scoop bucket rm nonportable
scoop bucket add nonportable "{{endpoint}}/nonportable.git"
scoop bucket rm java
scoop bucket add java "{{endpoint}}/java.git"
```
