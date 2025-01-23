"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { dateFormat } from "@/lib/utils";
import { CheckCircle, Trash, XCircle } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";
import DescriptionProblem from "./description-form";
import { Problem } from "./services/interface";

interface ProblemCardProps {
  problem: Problem;
  fetchData: () => void;
}

const FormSchema = z.object({
  date: z.date(),
  description: z.string().min(5, {
    message: "Digite uma mensagem.",
  }),
});

export default function ProblemCard({ problem, fetchData }: ProblemCardProps) {
  const deleteItem = async (id: number) => {
    Swal.fire({
      title: "Excluir registro?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43C04F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`problem/${id}`);
          fetchData();
          Swal.fire({
            title: "Excluído!",
            text: "Esse registro acabou de ser apagado.",
            icon: "success",
          });
        } catch (error) {
          console.error("Erro excluir dado:", error);
        }
      }
    });
  };

  const updateItem = async (id: number, status: string) => {
    if (status === "ACTIVE") status = "INACTIVE";
    else status = "ACTIVE";
    try {
      await api.patch(`problem/${id}`, { status });
      Swal.fire({
        title: "Status atualizado!",
        icon: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  const updateEmphasisItem = async (id: number, emphasis: boolean) => {
    emphasis = !emphasis;
    try {
      await api.patch(`problem/emphasis/${id}`, { emphasis });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  const updateMaintenanceItem = async (id: number, maintenance: boolean) => {
    maintenance = !maintenance;
    try {
      await api.patch(`problem/maintenance/${id}`, { maintenance });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  const deleteDescription = async (id: number) => {
    Swal.fire({
      title: "Excluir registro?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43C04F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`problem/description/${id}`);
          fetchData();
          Swal.fire({
            title: "Excluído!",
            text: "Esse registro acabou de ser apagado.",
            icon: "success",
          });
        } catch (error) {
          console.error("Erro excluir dado:", error);
        }
      }
    });
  };

  // const createDescription = async (problem: number) => {
  //   // TODO: abrir formulário para criar
  //   // const data = {
  //   //   date: date,
  //   //   description: description,
  //   //   comunicationProblemId: problem
  //   // }
  //   // try {
  //   //   await api.patch(`problem/description`, data);
  //   //   fetchData();
  //   // } catch (error) {
  //   //   console.error("Erro atualizar dado:", error);
  //   // }
  // };

  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll
    ? problem.comunicationDescription
    : problem.comunicationDescription.slice(0, 3);
  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <div>
      <div className="flex justify-between">
        <p className="font-semibold">Veículo</p>
        <div>
          {problem.status === "ACTIVE" ? (
            <p className="text-red-400">Problema ativo</p>
          ) : (
            <p className="text-green-400">Problema resolvido</p>
          )}
        </div>
      </div>
      <div className="flex justify-between border-stone-50 py-2 border-b">
        <div className="flex flex-col gap-2">
          <p>
            {problem.vehicle.licensePlate} - cod.{problem.vehicle.code}
          </p>
          <p>{problem.vehicle.fleet.name}</p>

          <div className="flex items-center gap-2">
            <p>STATUS OS: </p>
            {problem.emphasis ? (
              <button
                title="Marcar como Inativa"
                onClick={() =>
                  updateEmphasisItem(
                    problem.comunicationProblemId,
                    problem.emphasis
                  )
                }
              >
                <CheckCircle size={24} className="text-green-400" />
              </button>
            ) : (
              <button
                title="Marcar como Ativa"
                onClick={() =>
                  updateEmphasisItem(
                    problem.comunicationProblemId,
                    problem.emphasis
                  )
                }
              >
                <XCircle size={24} className="text-red-500" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p>STATUS MANUTENÇÃO: </p>
            {problem.isUnderMaintenance ? (
              <button
                title="Em manutenção"
                onClick={() =>
                  updateMaintenanceItem(
                    problem.comunicationProblemId,
                    problem.isUnderMaintenance
                  )
                }
              >
                <XCircle size={24} className="text-blue-400" />
              </button>
            ) : (
              <button
                title="Não está em manutenção"
                onClick={() =>
                  updateMaintenanceItem(
                    problem.comunicationProblemId,
                    problem.isUnderMaintenance
                  )
                }
              >
                <CheckCircle size={24} className="text-green-500" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {problem.status === "ACTIVE" ? (
            <button
              title="Marcar como resolvido"
              onClick={() =>
                updateItem(problem.comunicationProblemId, problem.status)
              }
            >
              <CheckCircle size={24} />
            </button>
          ) : (
            <button
              title="Marcar como não resolvido"
              onClick={() =>
                updateItem(problem.comunicationProblemId, problem.status)
              }
            >
              <XCircle size={24} />
            </button>
          )}
          <button
            title="Excluir"
            onClick={() => deleteItem(problem.comunicationProblemId)}
          >
            <Trash size={24} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold">Descrição</p>
        <DescriptionProblem fetchData={fetchData} problem={problem} />
      </div>
      {/* MAP NAS DESCRIÇÕES */}
      <div>
        {displayedItems.map((item) => {
          return (
            <div key={item.comunicationDescriptionId}>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    {dateFormat(item.date)} - {item.description}
                  </p>
                  <p className="text-primary text-sm capitalize">
                    Usuário: {item.user.name.split(" ")[0]}
                  </p>
                </div>
                <div>
                  <button
                    title="Excluir descrição"
                    onClick={() =>
                      deleteDescription(item.comunicationDescriptionId)
                    }
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {problem.comunicationDescription.length > 3 && (
          <div className="flex justify-end w-full">
            <Button onClick={toggleShowAll}>
              {showAll ? "Mostrar menos" : "Mostrar mais"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
