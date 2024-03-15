import { Menu } from "@/components/menu";
import FleetList from "@/modules/fleets/fleet-list";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";

export default function Fleets() {
  return (
    <>
      <Menu url="/painel" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          <UsersThree /> Frotas
        </h1>
        <FleetList />
      </main>
    </>
  );
}
