import { Menu } from "@/components/menu";
import VehicleForm from "@/modules/vehicles/vehicle-form";

export default function RegisterVehicle() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar veículo</h1>
        <VehicleForm />
      </section>
    </>
  );
}
