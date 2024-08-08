"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import DriverUpdateForm from "@/modules/drivers/driver-update-form";
import { DriverValues } from "@/modules/drivers/services/interface";
import { Fleet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Values {
  driverId: number;
  name: string;
  cpf: string;
  cnh: string;
  imageUrl: File;
  comments: string;
  status: "ACTIVE" | "INACTIVE";
  fleetId: number;
}

export default function UpdateDriver() {
  const [driver, setDriver] = useState<DriverValues | null>(null);
  const [values, setValues] = useState<Values>();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("driver/" + id);
      setDriver(response.data.driver);
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
    if (driver) {
      setValues({
        driverId: driver.driverId,
        name: driver.name,
        cpf: driver.cpf,
        cnh: driver.cnh,
        imageUrl: new File([], ""),
        comments: driver.comments,
        status: driver.status,
        fleetId: driver.fleetId,
      });
    }
  }, [driver]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="mt-2 mb-4 text-4xl">Atualizar motorista</h1>
        {values && driver && fleets ? (
          <DriverUpdateForm
            preloadedValues={values}
            id={id}
            driver={driver}
            fleets={fleets}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
