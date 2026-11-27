## 使用方法

SJTUG 镜像站支持通过适配工具 [glean](https://github.com/alissa-tung/glean) 安装 Elan、Lean 4 工具链及预下载 Lake 项目依赖。

访问以下地址可查看已收录的版本号，并下载对应平台的 `glean` 可执行文件：

```{ztmpl}
{{endpoint}}/?mirror_intel_list
```

### 安装 Elan

```bash
glean -install elan -version 3.1.1
```

### 安装 Lean 工具链

```bash
glean -install lean --version 4.5.0
```

如需安装 Nightly 版本（可用版本参见 {ztmpl}`{{endpoint}}/leanprover/lean4_nightly/releases/download?mirror_intel_list`）：

```bash
glean -install lean --version 4.4.0-nightly-2023-11-12
```

### 预下载 Lake 项目依赖

在包含 `lake-manifest.json` 的 Lean 4 项目根目录执行：

```bash
glean
```

或手动指定清单文件路径：

```bash
glean -lake-manifest-path /path/to/lake-manifest.json
```
