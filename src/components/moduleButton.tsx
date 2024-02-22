import Link from "next/link";

export default function ModuleButton({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={url}
      className="w-72 border border-stone-50 rounded-md text-3xl p-6 flex justify-center items-center gap-4 transition-colors hover:bg-stone-900 hover:border-primary hover:text-primary"
    >
      {children}
    </Link>
  );
}
