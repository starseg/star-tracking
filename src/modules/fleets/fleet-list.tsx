"use client";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Fleet } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FleetCard from "./card";
import { FleetProps } from "./services/interface";
import { ToastContainer } from "react-toastify";

export default function FleetList() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [fleets, setFleets] = useState<FleetProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "fleet";
      else path = `fleet?query=${params.get("query")}`;
      const response = await api.get(path);
      setFleets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);

  return (
    <>
      {isLoading ? (
        <p>carregando...</p>
      ) : (
        <div className="px-4">
          <div className="flex flex-col justify-end gap-2 md:justify-between  md:flex-row mb-4">
            <div className="flex gap-2">
              <Link href="/frotas/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar nova
                </Button>
              </Link>
              <div className="py-2 px-6 rounded-md bg-muted">
                Total: {fleets.length}
              </div>
            </div>
            <Search placeholder="Buscar..." pagination={false} />
          </div>
          <ToastContainer />
          <div className="flex flex-wrap gap-4">
            {fleets.map((fleet) => {
              return (
                <div
                  className="border border-primary rounded-lg p-4 flex flex-col md:w-[48%] lg:w-[49%] w-full"
                  key={fleet.fleetId}
                >
                  <FleetCard fleet={fleet} fetchData={fetch} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
