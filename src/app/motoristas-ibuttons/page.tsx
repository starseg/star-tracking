import { Menu } from "@/components/menu";
import Search from "@/components/search";
import DriverIButtonTable from "@/modules/drivers-ibuttons/driver-ibutton-table";

export default function DriversIButtons() {
  return (
    <>
      <Menu url="/painel" />
      <main className="mx-auto max-w-screen-lg">
        <div className="flex justify-between items-center mb-4 w-full">
          <h1 className="flex flex-1 items-center gap-2 text-4xl hover:text-primary transition-all hover:animate-bounce">
            Motoristas - I Buttons
          </h1>
          <div className="flex flex-1 justify-end pr-4">
            <Search placeholder="Buscar..." pagination={false} />
          </div>
        </div>
        <DriverIButtonTable />
      </main>
    </>
  );
}
