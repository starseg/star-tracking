"use client";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import VehicleTrackerTable from "@/modules/vehicles-trackers/vehicle-tracker-table";

export default function VehiclesTrackers() {
  return (
    <>
      <Menu url="/painel" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          Veículos - Rastreadores
        </h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <VehicleTrackerTable />
      </main>
    </>
  );
}
