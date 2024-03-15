export default function ColorItem({ color }: { color: string }) {
  return (
    <div
      className={`border h-8 w-8 rounded-full`}
      style={{ backgroundColor: color }}
    ></div>
  );
}
