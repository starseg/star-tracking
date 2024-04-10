"use client";
import { useEffect, useState } from "react";
import { IButton } from "@prisma/client";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import DetailsItem from "@/components/details-item";
import { Image } from "@phosphor-icons/react/dist/ssr";

interface IButtonProps extends IButton {
  deviceStatus: {
    deviceStatusId: number;
    description: string;
  };
}

export default function IButtonDetails() {
  const [IButton, setIButton] = useState<IButtonProps | null>(null);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;

  const fetch = async () => {
    try {
      const response = await api.get("ibutton/" + id);
      setIButton(response.data.ibutton);
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
        <DetailsItem label="Número" value={IButton?.number} />
        <DetailsItem label="Código" value={IButton?.code} />
        <DetailsItem
          label="Campo Programado"
          value={IButton?.programmedField}
        />
        <DetailsItem
          label="Status"
          value={IButton?.deviceStatus ? IButton?.deviceStatus.description : ""}
        />

        <DetailsItem label="Observações" value={IButton?.comments} />
      </div>
      <div className="w-1/2 space-y-2">
        <h3 className="font-semibold text-lg text-primary">Imagens</h3>
        <div className="flex gap-4 flex-wrap">
          {IButton?.url1 ? (
            <img
              src={IButton.url1}
              alt="Foto 1 do IButton"
              className="max-h-48 rounded-md border border-primary bg-stone-900 "
            />
          ) : (
            <Image className="h-48 w-48 rounded-md border border-primary bg-stone-900" />
          )}
          {IButton?.url2 ? (
            <img
              src={IButton.url2}
              alt="Foto 2 do IButton"
              className="max-h-48 rounded-md border border-primary bg-stone-900 "
            />
          ) : (
            <Image className="h-48 w-48 rounded-md border border-primary bg-stone-900" />
          )}
        </div>
      </div>
    </div>
  );
}
