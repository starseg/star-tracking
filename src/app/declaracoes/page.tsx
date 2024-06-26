import { Menu } from "@/components/menu";
import DeclarationList from "@/modules/declarations/declaration-list";
import { Note } from "@phosphor-icons/react/dist/ssr";

export default function Declaration() {
  return (
    <>
      <Menu url="/painel" />
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          <Note /> Declarações
        </h1>
        <DeclarationList />
      </div>
    </>
  );
}
