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
import { ArrowLeft, List, SignOut } from "@phosphor-icons/react/dist/ssr";
import BackButton from "./back-button";

export function Menu({ url = "" }: { url?: string }) {
  return (
    <header className="flex flex-row w-full justify-between md:justify-around items-center p-4">
      {url === "" ? (
        <BackButton />
      ) : url === "x" ? (
        ""
      ) : (
        <Link href={`${url}`}>
          <ArrowLeft size={"2.5rem"} />
        </Link>
      )}
      <Image
        src="/logo.svg"
        alt="Logo Star Tracking"
        width={356}
        height={68}
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
              href="/api/logout"
              className="flex items-center justify-center gap-2"
            >
              <SignOut /> Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
