import { Menu } from "@/components/menu";
import Search from "@/components/search";
import DriverIButtonTable from "@/modules/drivers-ibuttons/driver-ibutton-table";

export default function DriversIButtons() {
  return (
    <>
      <Menu url="/painel" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          Motoristas - I Buttons
        </h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <DriverIButtonTable />
      </main>
    </>
  );
}
