"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import IButtonUpdateForm from "@/modules/ibuttons/ibutton-update-form";
import { IButton, IButtonStatus } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Values {
  number: string;
  code: string;
  programmedField: string;
  comments: string;
  ibuttonStatusId: number;
}

export default function UpdateIButton() {
  const [ibutton, setIButton] = useState<IButton | null>(null);
  const [ibuttonStatus, setIButtonStatus] = useState<IButtonStatus[] | null>(
    null
  );
  const [values, setValues] = useState<Values>();

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
  const status = async () => {
    try {
      const response = await api.get("ibutton/status");
      setIButtonStatus(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
    status();
  }, []);

  useEffect(() => {
    if (ibutton) {
      setValues({
        number: ibutton?.number || "",
        code: ibutton?.code || "",
        programmedField: ibutton?.programmedField || "",
        comments: ibutton?.comments || "",
        ibuttonStatusId: ibutton?.ibuttonStatusId || 1,
      });
    }
  }, [ibutton]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar I Button</h1>
        {values && ibuttonStatus ? (
          <IButtonUpdateForm
            preloadedValues={values}
            id={id}
            status={ibuttonStatus}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
