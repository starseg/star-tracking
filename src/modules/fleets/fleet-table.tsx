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
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function FleetTable() {
  return (
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
        <TableBody>{/* map em frotas */}</TableBody>
      </Table>
      <div className="mt-8">
        <Link href="frotas/registro">
          <Button className="flex gap-2 font-semibold">
            <FilePlus size={24} /> Registrar nova
          </Button>
        </Link>
      </div>
    </div>
  );
}
