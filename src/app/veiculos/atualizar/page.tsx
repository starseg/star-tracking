"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import VehicleUpdateForm from "@/modules/vehicles/vehicle-update-form";
import { Vehicle, Fleet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Values {
  fleetId: number;
  model: string;
  licensePlate: string;
  code: string;
  renavam: string;
  chassis: string;
  year: string;
  installationDate: Date;
  comments: string;
  status: "ACTIVE" | "INACTIVE";
  url: File;
}

export default function UpdateVehicle() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [values, setValues] = useState<Values>();

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

  useEffect(() => {
    if (vehicle) {
      setValues({
        fleetId: vehicle?.fleetId || 0,
        model: vehicle?.model || "",
        licensePlate: vehicle?.licensePlate || "",
        code: vehicle?.code || "",
        renavam: vehicle?.renavam || "",
        chassis: vehicle?.chassis || "",
        year: vehicle?.year || "",
        installationDate: vehicle?.installationDate || "",
        comments: vehicle?.comments || "",
        url: new File([], ""),
        status: vehicle?.status || "ACTIVE",
      });
    }
  }, [vehicle]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar veículo</h1>
        {values && vehicle && fleets ? (
          <VehicleUpdateForm
            preloadedValues={values}
            id={id}
            fleets={fleets}
            vehicle={vehicle}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
