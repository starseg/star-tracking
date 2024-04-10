"use client";
import { Menu } from "@/components/menu";
import IButtonDetails from "@/modules/ibuttons/ibutton-details";

export default function Vehicles() {
  return (
    <>
      <Menu />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          Detalhes do IButton
        </h1>
        <IButtonDetails />
      </main>
    </>
  );
}
