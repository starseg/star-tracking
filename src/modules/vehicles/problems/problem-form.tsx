"use client";
import ComboboxDefault from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vehicle } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  vehicleId: z.number(),
  date: z.date(),
  description: z.string(),
});

export default function ProblemForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      vehicleId: 0,
      date: undefined,
      description: "",
    },
  });
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const fetchVehicles = async () => {
    try {
      const response = await api.get("vehicle");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await api.post("problem", data);
      if (response.status === 201) {
        router.push("/veiculos/problemas");
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  const VehicleItem = vehicles.map((vehicle) => {
    return {
      label: `${vehicle.licensePlate} - ${vehicle.code}`,
      value: vehicle.vehicleId,
    };
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <ComboboxDefault
          control={form.control}
          name="vehicleId"
          object={VehicleItem}
          label="Selecione o veículo"
          searchLabel="Buscar veículo..."
          selectLabel="Veículo"
          onSelect={(value: number) => {
            form.setValue("vehicleId", value);
          }}
        />

        <DatePicker
          control={form.control}
          name="date"
          label="Selecone uma data"
        />

        <TextareaDefault
          control={form.control}
          name="description"
          label="Observação"
          placeholder="Descreva as ações tomadas"
        />
        <Button type="submit" className="w-full text-lg">
          Registrar
        </Button>
      </form>
    </Form>
  );
}
