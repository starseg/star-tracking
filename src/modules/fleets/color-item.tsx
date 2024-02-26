export default function ColorItem({ color }: { color: string }) {
  return (
    <div
      className={`border h-6 w-6 rounded-full mr-4`}
      style={{ backgroundColor: color }}
    ></div>
  );
}
