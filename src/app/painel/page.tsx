"use client";
import { Menu } from "@/components/menu";
import ModuleButton from "@/components/moduleButton";
import AccessLinkList from "@/modules/access-links/access-link-list";
import {
  CodeBlock,
  Cpu,
  Footprints,
  Link,
  RadioButton,
  Truck,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <>
      <Menu url="x" />
      <main className="max-w-screen-lg mx-auto mb-12">
        <h1 className="text-4xl flex gap-2 items-center mb-8 px-2 hover:animate-bounce hover:text-primary transition-all">
          <Footprints weight="fill" /> Rastreamento
        </h1>
        <div className="flex gap-16 flex-wrap items-center px-4">
          <ModuleButton url="motoristas">
            <UserCircle /> Motoristas
          </ModuleButton>
          <ModuleButton url="ibuttons">
            <RadioButton /> I Buttons
          </ModuleButton>
          <ModuleButton url="motoristas-ibuttons">
            <UserCircle /> + <RadioButton />
          </ModuleButton>
          <ModuleButton url="veiculos">
            <Truck /> Veículos
          </ModuleButton>
          <ModuleButton url="rastreadores">
            <Cpu /> Rastreadores
          </ModuleButton>
          <ModuleButton url="veiculos-rastreadores">
            <Truck /> + <Cpu />
          </ModuleButton>
          <ModuleButton url="frotas">
            <UsersThree /> Frotas
          </ModuleButton>
          <ModuleButton url="programacao">
            <CodeBlock /> Programação
          </ModuleButton>
          {/* <ModuleButton url="declaracoes">
            <Note /> Declarações
          </ModuleButton> */}
        </div>
        <div className="flex flex-col mt-8 px-4">
          <h2 className="text-3xl flex gap-2 items-center mb-4 hover:text-primary transition-all">
            <Link /> Acessos ao sistema rastreador
          </h2>
          <AccessLinkList />
        </div>
      </main>
    </>
  );
}
