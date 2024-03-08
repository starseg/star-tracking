"use client";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Problem } from "./services/interface";
import ProblemCard from "./card";

export default function ProblemList() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "problem";
      else path = `problem?query=${params.get("query")}`;
      const response = await api.get(path);
      setProblems(response.data);
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
        // criar skeleton
        <p>carregando...</p>
      ) : (
        <div className="px-4">
          <div className="flex flex-col justify-end gap-2 md:justify-between  md:flex-row mb-4">
            <Link href="problemas/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar novo
              </Button>
            </Link>
            <Search placeholder="Buscar..." pagination={false} />
          </div>
          <div className="flex flex-wrap gap-4">
            {problems.map((problem) => {
              return (
                <div
                  className="border border-primary rounded-lg p-4 flex flex-col md:w-[48%] lg:w-[49%] w-full"
                  key={problem.comunicationProblemId}
                >
                  <ProblemCard problem={problem} fetchData={fetch} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
