import { useEffect, useState } from "react";
import { Fleet } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Car,
  FilePlus,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";
import ColorItem from "./color-item";

// const [fieldColor, setFieldColor] = useState("bg-[#ffff11]");
//   setFieldColor(`bg-[${data.color}]`);
//   alert(fieldColor);
//   <div className={cn("h-4 w-4 rounded-full", fieldColor)}></div>

export default function FleetTable() {
  // busca das frotas
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = async () => {
    try {
      const response = await api.get("fleet");
      setFleets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  // deletar frota
  const deleteFleet = async (id: number) => {
    Swal.fire({
      title: "Excluir data?",
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
          console.log("TESTE");

          const res = await api.delete("fleet", {
            data: id,
          });
          console.log(res);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Essa frota acabou de ser apagada.",
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
        <div className="w-full mt-16 flex items-center justify-center">
          carregando...
        </div>
      ) : (
        <div>
          <Table className="max-h-[60vh] overflow-x-auto border border-stone-800 rouded-lg">
            <TableHeader className="bg-stone-800 font-semibold">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleets.map((fleet) => {
                const color = `bg-[${fleet.color}]`;
                return (
                  <TableRow key={fleet.fleetId}>
                    <TableCell className={`flex items-center gap-2`}>
                      <ColorItem color={fleet.color} />
                      {fleet.name}
                    </TableCell>
                    <TableCell>{fleet.responsible}</TableCell>
                    <TableCell>{fleet.telephone}</TableCell>
                    <TableCell>{fleet.email}</TableCell>
                    <TableCell className="flex gap-4 text-2xl">
                      <Link href={`/veiculos?query=${fleet.fleetId}`}>
                        <Car />
                      </Link>
                      <Link href={`/frotas/atualizar?id=${fleet.fleetId}`}>
                        <PencilLine />
                      </Link>
                      <button
                        title="Excluir"
                        onClick={() => deleteFleet(fleet.fleetId)}
                      >
                        <Trash />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-8">
            <Link href="frotas/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar nova
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
