import { Menu } from "@/components/menu";
import DriverIButtonForm from "@/modules/drivers-ibuttons/driver-ibutton-form";

export default function RegisterDriverIButton() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Relacionar motorista e I Button</h1>
        <DriverIButtonForm />
      </section>
    </>
  );
}
