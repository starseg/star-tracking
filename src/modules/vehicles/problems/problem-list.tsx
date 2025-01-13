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
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import clsx from "clsx";

export default function ProblemList() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(false);

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
        <SkeletonCard />
      ) : (
        <div className="px-4">
          <div className="flex md:flex-row flex-col justify-end md:justify-between gap-2 mb-4">
            <div className="flex gap-4">
              <Link href="problemas/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar novo
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="statusFilter"
                  onClick={() => setActive(!active)}
                />
                <label
                  htmlFor="statusFilter"
                  className="font-medium text-sm leading-none"
                >
                  Apenas ATIVOS
                </label>
              </div>
            </div>
            <Search placeholder="Buscar..." pagination={false} />
          </div>
          <div className="flex flex-wrap gap-4">
            {problems.map((problem) => {
              if (active && problem.status === "INACTIVE") return;
              return (
                <div
                  className={cn(
                    "flex flex-col border-primary p-4 border rounded-lg w-full md:w-[48%] lg:w-[49%]",
                    problem.emphasis
                      ? "border-green-500 border-2"
                      : "border-primary"
                  )}
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
