### Scoop 本体使用官方源

自动选择入口可能跳转到不提供 Scoop 本体的镜像站。Scoop 本体请使用官方源；如果之前配置了镜像地址，请执行以下命令恢复（更新本体需要能够访问 GitHub）：

```powershell
scoop config SCOOP_REPO "https://github.com/ScoopInstaller/Scoop"
```
