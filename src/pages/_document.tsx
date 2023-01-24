import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {/*
  ((localStorage, document) => {
    try {
      const mode = localStorage['user-color-scheme'];
      if (mode) {
        document.documentElement.classList.add(mode)
      }
    } catch (e) {}
  })(localStorage, document)
        */}
        {process.env.NODE_ENV !== 'production' && <script
          dangerouslySetInnerHTML={{
            __html: `
/**
 * !!WARNING!!
 * TEMPORARILY WORKAROUND A REACT DEVTOOLS ISSUE https://github.com/facebook/react/issues/25994
 * REMOVE AFTER THE ISSUE IS FIXED
 */
// Save the original __REACT_DEVTOOLS_GLOBAL_HOOK__.inject
const reactDevToolsHookInject = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject;
// Override the original __REACT_DEVTOOLS_GLOBAL_HOOK__.inject
// This will allow us to intercept and modify incoming injectProfilingHooks
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function inject(...args) {
  const newArgs = args.map(arg => {
    // Only modify the original arguments when injectProfilingHooks is present
    if (!arg || !arg.injectProfilingHooks) return arg;

    const { injectProfilingHooks: originalInjectProfilingHooks, ...rest } = arg;
    return {
      // Override the original injectProfilingHooks
      // This will allow us to intercept and modify incoming hooks
      injectProfilingHooks(...hooks) {
        const newHooks = hooks.map(hook => {
          // Only modify the original hooks when markComponentSuspended is present
          if (!hook || !hook.markComponentSuspended) return hook;

          // Exclude markComponentSuspended from the hook
          // This will break certain React DevTools features,
          // but the render won't be blocked
          const { markComponentSuspended, ...rest2 } = hook;
          return rest2;
        });
        originalInjectProfilingHooks.apply(this, newHooks);
      },
      ...rest
    };
  });
  return reactDevToolsHookInject.apply(this, newArgs);
};
            `
          }}
        />}
        <script dangerouslySetInnerHTML={{ __html: '!function(b,c){try{var a=b["user-color-scheme"];a&&c.classList.add(a)}catch(d){}}(localStorage,document.documentElement)' }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
