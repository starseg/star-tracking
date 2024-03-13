import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Sair() {
  return (
    <>
      <div className="flex flex-col gap-4 w-full h-screen items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Logo Star Tracking"
          width={352}
          height={46}
          priority={true}
          className="max-w-[80%] hidden md:block"
        />
        <h1 className="text-xl">Sua conta foi desconectada.</h1>
        <Link href="/api/logout">
          <Button>Voltar para o login</Button>
        </Link>
      </div>
    </>
  );
}
