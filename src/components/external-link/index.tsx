export default function ExternalLink({ href, ...props }: JSX.IntrinsicElements['a']) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
