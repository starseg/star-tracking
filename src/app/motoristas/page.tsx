import { Menu } from "@/components/menu";
import Search from "@/components/search";
import DriverTable from "@/modules/drivers/driver-table";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";

export default function IButtons() {
  return (
    <>
      <Menu url="/painel" />
      <main className="mx-auto max-w-screen-lg">
        <div className="flex justify-between items-center mb-4 w-full">
          <h1 className="flex justify-center items-center gap-2 text-4xl hover:text-primary transition-all hover:animate-bounce">
            <UserCircle /> Motoristas
          </h1>
          <div className="flex justify-end pr-4 w-full">
            <Search placeholder="Buscar..." pagination={false} />
          </div>
        </div>
        <DriverTable />
      </main>
    </>
  );
}
