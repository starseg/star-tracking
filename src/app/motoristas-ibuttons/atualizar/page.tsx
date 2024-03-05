"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import DriverIButtonUpdateForm from "@/modules/drivers-ibuttons/driver-ibutton-update-form";
import { Driver, IButton, DriverIButton } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateDriverIButton() {
  const [driverIButton, setDriverIButton] = useState<DriverIButton | null>(
    null
  );

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("driver-ibutton/" + id);
      setDriverIButton(response.data.driverIButton);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const fetchDrivers = async () => {
    try {
      const response = await api.get("driver");
      setDrivers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [ibuttons, setIButtons] = useState<IButton[]>([]);
  const fetchIButtons = async () => {
    try {
      const response = await api.get("ibutton");
      setIButtons(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
    fetchDrivers();
    fetchIButtons();
  }, []);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar relacionamento</h1>
        {driverIButton && drivers && ibuttons ? (
          <DriverIButtonUpdateForm
            preloadedValues={driverIButton}
            id={id}
            drivers={drivers}
            ibuttons={ibuttons}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
