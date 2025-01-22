import { Menu } from "@/components/menu";
import Search from "@/components/search";
import VehicleTable from "@/modules/vehicles/vehicle-table";
import { Truck } from "@phosphor-icons/react/dist/ssr";

export default function Vehicles() {
  return (
    <>
      <Menu url="/painel" />
      <main className="mx-auto max-w-screen-lg">
        <div className="flex justify-between items-center mb-4 w-full">
          <h1 className="flex flex-1 items-center gap-2 text-4xl hover:text-primary transition-all hover:animate-bounce">
            <Truck /> Veículos
          </h1>
          <div className="flex flex-1 justify-end pr-4">
            <Search placeholder="Buscar..." pagination={false} />
          </div>
        </div>
        <VehicleTable />
      </main>
    </>
  );
}
