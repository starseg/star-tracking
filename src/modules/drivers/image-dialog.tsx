import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "@phosphor-icons/react/dist/ssr";

export default function ImageDialog({
  name,
  url,
}: {
  name: string;
  url: string | null;
}) {
  const urlIsFalse = url === null || url === "";
  return (
    <Dialog>
      <DialogTrigger
        disabled={urlIsFalse}
        className="disabled:opacity-50"
        title={!urlIsFalse ? "Abrir imagem" : "Nenhuma imagem registrada"}
      >
        <Image />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>Foto de {name}</DialogTitle>
          <DialogDescription>
            {url && <img src={url} alt={name} className="rounded-lg" />}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
