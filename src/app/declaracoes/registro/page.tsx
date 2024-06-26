import { Menu } from "@/components/menu";
import DeclarationForm from "@/modules/declarations/declaration-form";

export default function RegisterDeclaration() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar declaração</h1>
        <DeclarationForm />
      </section>
    </>
  );
}
