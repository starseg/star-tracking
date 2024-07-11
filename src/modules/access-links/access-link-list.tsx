"use client";

import { useEffect, useState } from "react";
import AccessLinkCard from "./access-link-card";
import { AccessLink } from "@prisma/client";
import api from "@/lib/axios";

export default function AccessLinkList() {
  const [accessLinks, setAccessLinks] = useState<AccessLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = async () => {
    try {
      const response = await api.get("access-link");
      setAccessLinks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return (
    <section>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="flex gap-4">
          {accessLinks.map((link) => (
            <AccessLinkCard
              key={link.accessLinkId}
              title={link.title}
              login={link.login}
              password={link.password}
              link={link.link}
            />
          ))}
        </div>
      )}
    </section>
  );
}
