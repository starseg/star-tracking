import { ArrowFatRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function AccessLinkCard({
  title,
  login,
  password,
  link,
}: {
  title: string;
  login: string;
  password: string;
  link: string;
}) {
  return (
    <div className="w-64 flex flex-col gap-2 border border-stone-50 p-4 rounded-md transition-colors hover:bg-stone-900 hover:border-primary">
      <p className="font-bold">{title}</p>
      <p>
        Login: <span className="p-1 bg-stone-800 rounded-md">{login}</span>
      </p>
      <p className="my-1">
        Senha:{" "}
        <span className="p-1 my-2 bg-stone-800 rounded-md">{password}</span>
      </p>
      <Link
        href={link}
        target="_blank"
        className="flex items-center justify-center gap-2 border p-2 rounded-md hover:bg-stone-800 transition-colors"
      >
        acessar <ArrowFatRight />
      </Link>
    </div>
  );
}
