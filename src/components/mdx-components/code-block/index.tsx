import CodeBlockMenu from './menus';

interface Menu {
  title: string;
  variableName: string,
  items: [displayName: string, value: string][];
}

interface CodeBlockProps {
  isHttpProtocol?: boolean;
  menus?: Menu[];
  children: React.ReactElement;
  code: string;
  codeLanguage?: string;
  codeMeta?: string;
}

export default function CodeBlock({ menus, isHttpProtocol = true, code }: CodeBlockProps) {
  return (
    <div>
      <CodeBlockMenu menus={menus} isHttpProtocol={isHttpProtocol} />
      <pre>
        <code>
          {code}
        </code>
      </pre>
    </div>
  );
}
