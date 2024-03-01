interface DetailsItemProps {
  label: string;
  value: string | undefined;
  fallback?: string;
}
export default function DetailsItem({
  label,
  value,
  fallback = "Sem dados",
}: DetailsItemProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg text-primary">{label}</h3>
      <p className="bg-stone-800 p-2 rounded-md">{value ? value : fallback}</p>
    </div>
  );
}
