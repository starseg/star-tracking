import { Menu } from "@/components/menu";
import TrackerForm from "@/modules/trackers/tracker-form";

export default function RegisterTracker() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar rastreador</h1>
        <TrackerForm />
      </section>
    </>
  );
}
