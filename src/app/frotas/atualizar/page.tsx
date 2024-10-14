"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import FleetUpdateForm from "@/modules/fleets/fleet-update-form";
import { Fleet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Values {
  name: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  comments: string;
}

export default function UpdateFleet() {
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [values, setValues] = useState<Values>();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("fleet/" + id);
      setFleet(response.data.fleet);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (fleet) {
      setValues({
        name: fleet?.name || "",
        color: fleet?.color || "",
        status: fleet?.status || "ACTIVE",
        comments: fleet?.comments || "",
      });
    }
  }, [fleet]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="mt-2 mb-4 text-4xl">Atualizar frota</h1>
        {values ? (
          <FleetUpdateForm preloadedValues={values} id={id} />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
