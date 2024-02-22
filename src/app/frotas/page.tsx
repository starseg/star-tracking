"use client";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import FleetTable from "@/modules/fleets/fleet-table";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";

export default function Fleets() {
  return (
    <>
      <Menu url="x" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          <UsersThree /> Frotas
        </h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <FleetTable />
      </main>
    </>
  );
}
