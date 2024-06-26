"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import DeclarationCard from "./card";
import { useEffect, useState } from "react";
import { Declaration } from "@prisma/client";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeclarationList() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = async () => {
    try {
      const response = await api.get("declaration");
      setDeclarations(response.data);
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
      <div className="mb-4">
        <Link
          href="declaracoes/registro"
          className={buttonVariants({ variant: "default" })}
        >
          Criar nova
        </Link>
      </div>
      <div className="max-h-[60vh] overflow-y-auto flex flex-wrap items-center justify-center bg-stone-800 rounded-lg py-4">
        {isLoading ? (
          <>
            <Skeleton className="w-[30%] h-36 bg-stone-900 m-2" />
            <Skeleton className="w-[30%] h-36 bg-stone-900 m-2" />
            <Skeleton className="w-[30%] h-36 bg-stone-900 m-2" />
            <Skeleton className="w-[30%] h-36 bg-stone-900 m-2" />
            <Skeleton className="w-[30%] h-36 bg-stone-900 m-2" />
            <Skeleton className="w-[30%] h-36 bg-stone-900 m-2" />
          </>
        ) : (
          declarations.map((declaration) => (
            <DeclarationCard
              key={declaration.declarationId}
              id={declaration.declarationId}
              title={declaration.title}
              date={declaration.updatedAt.toString()}
              url={declaration.url}
              fetchData={fetch}
            />
          ))
        )}
      </div>
    </section>
  );
}
