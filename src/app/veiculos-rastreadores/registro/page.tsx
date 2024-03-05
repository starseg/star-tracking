import { Menu } from "@/components/menu";
import VehicleTrackerForm from "@/modules/vehicles-trackers/vehicle-tracker-form";

export default function RegisterVehicleTracker() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Relacionar veículo e rastreador</h1>
        <VehicleTrackerForm />
      </section>
    </>
  );
}
