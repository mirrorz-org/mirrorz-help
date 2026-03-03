import { createContextState } from 'foxact/context-state';
// @ts-expect-error -- We need to import the template runtime, which lacks types
import HoganRuntime from 'hogan.js/lib/template';
import type { Template as HoganTemplate } from 'hogan.js';
import { useMemo, useEffect, useId } from 'react';
import Script from 'next/script';

const [NestedCompiledTemplatesProvider, useCompiledTemplates, useSetCompiledTemplates] = createContextState<Record<string, HoganTemplate>>({});

function useTemplate(templateId: string): HoganTemplate {
  const compiledTemplates = useCompiledTemplates();
  return useMemo(() => compiledTemplates[templateId] || { render: () => '' } as HoganTemplate, [templateId, compiledTemplates]);
}

function CompiledTemplatesProvider({ children, compiledTemplates }: { children: React.ReactNode, compiledTemplates: Record<string, string> }) {
  const templateString = useMemo(() => `{${Object.entries(compiledTemplates).map(([key, value]) => `${JSON.stringify(key)}: ${value}`).join(',')}}`, [compiledTemplates]);
  const randomStr = useId();

  function TemplateImporter() {
    const setCompiledTemplates = useSetCompiledTemplates();
    useEffect(() => {
      const importedRegistry: Record<string, HoganTemplate> = {};
      Object.entries((document.getElementById(`template-loader-${randomStr}`) as any)?.compiledTemplates || {}).forEach(([templateId, compiledTemplateObj]) => {
        const compiledTemplate = new HoganRuntime.Template(compiledTemplateObj) as HoganTemplate;
        importedRegistry[templateId] = compiledTemplate;
      });
      setCompiledTemplates(importedRegistry);
    });
    return null;
  }

  return (
    <>
      <Script key={randomStr} id={`template-loader-${randomStr}`}>
        document.getElementById({JSON.stringify(`template-loader-${randomStr}`)}).compiledTemplates = {templateString};
      </Script>
      <NestedCompiledTemplatesProvider>
        <TemplateImporter />
        {children}
      </NestedCompiledTemplatesProvider>
    </>
  );
}

export { CompiledTemplatesProvider, useTemplate };
