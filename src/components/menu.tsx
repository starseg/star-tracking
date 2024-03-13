"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  List,
  RadioButton,
  SignOut,
  Truck,
  UserCircle,
  Users,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import BackButton from "./back-button";

export function Menu({ url = "" }: { url?: string }) {
  return (
    <header className="flex flex-row w-full justify-between md:justify-around items-center p-4">
      {url === "" ? (
        <BackButton />
      ) : url === "x" ? (
        <div></div>
      ) : (
        <Link href={`${url}`}>
          <ArrowLeft size={"2.5rem"} />
        </Link>
      )}
      <Image
        src="/logo.svg"
        alt="Logo Star Tracking"
        width={352}
        height={46}
        priority={true}
        className="max-w-[80%] hidden md:block"
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <List size={"2.5rem"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link
              href="/usuarios"
              className="flex items-center justify-center gap-2"
            >
              <Users size={24} /> Usuários
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/motoristas"
              className="flex items-center justify-center gap-2"
            >
              <UserCircle size={24} /> Motoristas
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/veiculos"
              className="flex items-center justify-center gap-2"
            >
              <Truck size={24} /> Veículos
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/ibuttons"
              className="flex items-center justify-center gap-2"
            >
              <RadioButton size={24} /> I Buttons
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/rastreadores"
              className="flex items-center justify-center gap-2"
            >
              <Cpu size={24} /> Rastreadores
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/frotas"
              className="flex items-center justify-center gap-2"
            >
              <UsersThree size={24} /> Frotas
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/motoristas-ibuttons"
              className="flex items-center justify-center gap-2"
            >
              <UserCircle size={24} /> + <RadioButton size={24} />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/veiculos-rastreadores"
              className="flex items-center justify-center gap-2"
            >
              <Truck size={24} /> + <Cpu size={24} />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2"
            >
              <SignOut size={24} /> Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
