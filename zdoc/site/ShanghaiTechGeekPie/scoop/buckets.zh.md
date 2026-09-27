### 将 bucket 切换至镜像

上科大提供以下 9 个官方 bucket；不提供 sysinternals 镜像，该 bucket 请保留官方源。games 和 nerd-fonts 的仓库名分别为 `games.git` 和 `nerd-fonts.git`。

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
scoop bucket rm nerd-fonts
scoop bucket add nerd-fonts "{{endpoint}}/nerd-fonts.git"
scoop bucket rm nonportable
scoop bucket add nonportable "{{endpoint}}/nonportable.git"
scoop bucket rm java
scoop bucket add java "{{endpoint}}/java.git"
scoop bucket rm games
scoop bucket add games "{{endpoint}}/games.git"
```
