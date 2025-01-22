import { Menu } from "@/components/menu";
import Search from "@/components/search";
import VehicleTrackerTable from "@/modules/vehicles-trackers/vehicle-tracker-table";

export default function VehiclesTrackers() {
  return (
    <>
      <Menu url="/painel" />
      <main className="mx-auto max-w-screen-lg">
        <div className="flex justify-between items-center mb-4 w-full">
          <h1 className="flex flex-1 items-center gap-2 text-4xl hover:text-primary transition-all hover:animate-bounce">
            Veículos - Rastreadores
          </h1>
          <div className="flex flex-1 justify-end pr-4">
            <Search placeholder="Buscar..." pagination={false} />
          </div>
        </div>
        <VehicleTrackerTable />
      </main>
    </>
  );
}
