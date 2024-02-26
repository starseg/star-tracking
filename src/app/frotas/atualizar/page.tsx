import { Menu } from "@/components/menu";
import FleetForm from "@/modules/fleets/fleet-form";

export default function UpdateFleet() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar frota</h1>
        <FleetForm />
      </section>
    </>
  );
}
