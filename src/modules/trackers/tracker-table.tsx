import { useEffect, useState } from "react";
import { Tracker } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Car,
  FilePlus,
  PencilLine,
  Person,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

interface TrackerProps extends Tracker {
  deviceStatus: {
    deviceStatusId: number;
    description: string;
  };
}

export default function TrackerTable() {
  // busca das frotas
  const [trackers, setTrackers] = useState<TrackerProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "tracker";
      else path = `tracker?query=${params.get("query")}`;
      const response = await api.get(path);
      setTrackers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);
  // deletar frota
  const deleteTracker = async (id: number) => {
    Swal.fire({
      title: "Excluir rastreador?",
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
          await api.delete(`tracker/${id}`);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Esse rastreador acabou de ser apagado.",
            icon: "success",
          });
        } catch (error) {
          console.error("Erro excluir dado:", error);
        }
      }
    });
  };

  return (
    <div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-x-auto">
            <Table className="border border-stone-800">
              <TableHeader className="bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Operadora</TableHead>
                  <TableHead>ICCID</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackers.length > 0 ? (
                  trackers.map((tracker) => {
                    return (
                      <TableRow key={tracker.trackerId}>
                        <TableCell>{tracker.trackerId}</TableCell>
                        <TableCell>{tracker.number}</TableCell>
                        <TableCell>{tracker.model}</TableCell>
                        <TableCell>{tracker.chipOperator}</TableCell>
                        <TableCell>{tracker.iccid}</TableCell>
                        <TableCell>{tracker.output}</TableCell>
                        <TableCell>
                          {tracker.comments ? tracker.comments : "Nenhuma"}
                        </TableCell>
                        <TableCell>
                          {tracker.deviceStatus.description}
                        </TableCell>
                        <TableCell className="flex gap-4 text-2xl">
                          <Link href={`/veiculos?query=${tracker.trackerId}`}>
                            <Car />
                          </Link>
                          <Link
                            href={`/rastreadores/atualizar?id=${tracker.trackerId}`}
                          >
                            <PencilLine />
                          </Link>
                          <button
                            title="Excluir"
                            onClick={() => deleteTracker(tracker.trackerId)}
                          >
                            <Trash />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-8 flex justify-between">
            <Link href="rastreadores/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar novo
              </Button>
            </Link>
            <div className="py-2 px-6 rounded-md bg-muted">
              Total: {trackers.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
