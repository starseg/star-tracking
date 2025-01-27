import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/axios";
import { deleteAction } from "@/lib/delete-action";
import { deleteFile } from "@/lib/firebase-upload";
import { cn, dateFormat } from "@/lib/utils";
import { BookOpen, Trash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface DeclarationCardProps {
  id: number;
  title: string;
  date: string;
  url: string;
  fetchData: () => void;
}

export default function DeclarationCard({
  id,
  title,
  date,
  url,
  fetchData,
}: DeclarationCardProps) {
  const deleteDeclaration = async (id: number, route: string) => {
    deleteAction("declaração", `${route}/${id}`, fetchData);
    deleteFile(url);
  };

  return (
    <Card className="border-primary/50 m-2 w-[30%]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{dateFormat(date)}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Link
          href={url}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex gap-2 items-center"
          )}
        >
          <BookOpen size={24} /> Abrir
        </Link>
        <Button
          variant={"outline"}
          className="p-0 aspect-square"
          onClick={() => deleteDeclaration(id, "declaration")}
        >
          <Trash size={24} />
        </Button>
      </CardContent>
    </Card>
  );
}
