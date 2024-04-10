import DetailsItem from "@/components/details-item";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { dateFormat } from "@/lib/utils";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { Vehicle } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface VehicleProps extends Vehicle {
  fleet: {
    name: string;
    color: string;
  };
}

export default function VehicleDetails() {
  const [vehicle, setVehicle] = useState<VehicleProps | null>(null);

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
  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="border border-primary rounded-md p-8 flex gap-8">
      <div className="w-1/2 space-y-2">
        <DetailsItem label="Frota" value={vehicle?.fleet.name} />
        <DetailsItem label="Modelo" value={vehicle?.model} />
        <DetailsItem label="Placa" value={vehicle?.licensePlate} />
        <DetailsItem label="Código" value={vehicle?.code} />
        <DetailsItem
          label="Status"
          value={vehicle?.status === "INACTIVE" ? "Inativo" : "Ativo"}
        />
        {vehicle?.url ? (
          <Button variant={"outline"}>
            <Link href={vehicle.url} target="_blank" className="flex gap-4">
              Anexos <DownloadSimple size={24} />
            </Link>
          </Button>
        ) : (
          <Button variant={"outline"} disabled>
            Sem anexos
          </Button>
        )}
      </div>
      <div className="w-1/2 space-y-2">
        <DetailsItem label="Renavam" value={vehicle?.renavam} />
        <DetailsItem label="Chassis/Série" value={vehicle?.chassis} />
        <DetailsItem label="Ano" value={vehicle?.year} />
        <DetailsItem
          label="Data de instalação"
          value={
            vehicle?.installationDate
              ? dateFormat(vehicle.installationDate)
              : undefined
          }
        />
        <DetailsItem label="Observação" value={vehicle?.comments} />
      </div>
    </div>
  );
}
