"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import DriverUpdateForm from "@/modules/drivers/driver-update-form";
import { DriverValues } from "@/modules/drivers/services/interface";
import { Fleet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateDriver() {
  const [driver, setDriver] = useState<DriverValues | null>(null);

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

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar motorista</h1>
        {driver && fleets ? (
          <DriverUpdateForm preloadedValues={driver} id={id} fleets={fleets} />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
