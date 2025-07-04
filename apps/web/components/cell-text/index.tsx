export function CellText({ text }: { text: string }) {
  return (
    <div className="max-w-72 truncate" title={text}>
      {text}
    </div>
  );
}
