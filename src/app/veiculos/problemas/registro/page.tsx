import { Menu } from "@/components/menu";
import ProblemForm from "@/modules/vehicles/problems/problem-form";

export default function RegisterProblem() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">
          Registrar problema de comunicação
        </h1>
        <ProblemForm />
      </section>
    </>
  );
}
