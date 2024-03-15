"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import VehicleUpdateForm from "@/modules/vehicles/vehicle-update-form";
import { Vehicle, Fleet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateVehicle() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("vehicle/" + id);
      setVehicle(response.data.vehicle);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const fetchFleets = async () => {
    try {
      const response = await api.get("fleet");
      setFleets(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
    fetchFleets();
  }, []);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar veículo</h1>
        {vehicle && fleets ? (
          <VehicleUpdateForm
            preloadedValues={vehicle}
            id={id}
            fleets={fleets}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
