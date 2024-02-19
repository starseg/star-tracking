import { Menu } from "@/components/menu";

export default function Home() {
  return (
    <>
      <Menu />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <h1 className="text-3xl">Bem vindo(a)!</h1>
      </main>
    </>
  );
}
