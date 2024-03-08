"use client";
import { Menu } from "@/components/menu";
import ProblemList from "@/modules/vehicles/problems/problem-list";

export default function Vehicles() {
  return (
    <>
      <Menu url="/painel" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all text-center">
          Problemas de comunicação
        </h1>
        <ProblemList />
      </main>
    </>
  );
}
