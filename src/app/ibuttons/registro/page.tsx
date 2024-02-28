import { Menu } from "@/components/menu";
import IButtonForm from "@/modules/ibuttons/ibutton-form";

export default function RegisterIButton() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar I Button</h1>
        <IButtonForm />
      </section>
    </>
  );
}
