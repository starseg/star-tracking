"use client";
import { Menu } from "@/components/menu";
import VehicleDetails from "@/modules/vehicles/vehicle-details";

export default function Vehicles() {
  return (
    <>
      <Menu />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          Detalhes do veículo
        </h1>
        <VehicleDetails />
      </main>
    </>
  );
}
