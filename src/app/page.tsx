"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src="/logo.svg"
        alt="Logo"
        height={46}
        width={352}
        priority={true}
      />
      <Link
        className="text-stone-50 text-lg underline underline-offset-2 hover:text-primary transition-colors"
        href={"painel"}
      >
        Acesse a plataforma
      </Link>
    </main>
  );
}
