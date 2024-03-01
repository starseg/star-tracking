import DetailsItem from "@/components/details-item";
import api from "@/lib/axios";
import { dateFormat } from "@/lib/utils";
import { Vehicle } from "@prisma/client";
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
