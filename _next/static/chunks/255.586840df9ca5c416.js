"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[255],{1255:function(e,r,s){s.r(r),s.d(r,{default:function(){return A}});var i=s(5893),t=s(8893),n=s(7294),l=s(1963),a=s(7919),h=s(2626),o=s(8791),g=s(6167),m=s(5688),d=s(4650),c=s(5246),Z=s(276),u=s(1042),w=s(140),k=s(3934),p=s(6229),b=s(8262),f=s(3049),j=s(512);let x=(0,t.B)();x.register("markdown",a.Z),x.registerAlias({markdown:["mdown","mkdn","mdwn","ron"]}),x.register("ini",h.Z),x.registerAlias({ini:["toml","conf"]}),x.register("properties",o.Z),x.register("bash",g.Z),x.registerAlias({bash:["sh","zsh","fish","shell"]}),x.register("yaml",m.Z),x.registerAlias({yaml:["yml"]}),x.register("lisp",d.Z),x.register("julia",c.Z),x.register("nix",Z.Z),x.register("xml",u.Z),x.register("r",w.Z),x.register("powershell",k.Z),x.register("clojure",p.Z),x.register("dos",b.Z),x.register("perl",f.Z);let y={mdown:"markdown",mkdn:"markdown",mdwn:"markdown",ron:"markdown",toml:"ini",sh:"bash",zsh:"bash",fish:"bash",shell:"bash",console:"bash",yml:"yaml",text:"plain"};function A(e){let{code:r,language:s}=e,t=(0,n.useMemo)(()=>(0,l.v)(x.highlight(s,r),{Fragment:i.Fragment,jsx:i.jsx,jsxs:i.jsxs}),[r,s]);return(0,i.jsx)("pre",{className:(0,j.Z)("hljs","language-".concat(y[s]||s)),children:(0,i.jsx)("code",{children:t})})}}}]);