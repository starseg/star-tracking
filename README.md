# Controle de Rastreamento de Veículos

Este é um projeto desenvolvido com Next.js 14, TypeScript, Prisma ORM e MySQL, utilizando diversas bibliotecas complementares para agilizar o desenvolvimento e fornecer uma experiência completa tanto para o back-end quanto para o front-end. O objetivo desta aplicação é fornecer um sistema de controle operacional para o processo de rastreamento de veículos, permitindo o registro de frotas, veículos, motoristas, dispositivos rastreadores, dispositivos de liberação do motorista (conhecidos como IButtons) e gerenciando suas relações de forma eficiente.

## Funcionalidades Principais

- **Registro de Frotas:** Cadastre e gerencie diferentes frotas de veículos.
- **Registro de Veículos:** Adicione novos veículos e mantenha um registro detalhado de cada um.
- **Registro de Motoristas:** Gerencie os motoristas associados aos veículos, incluindo suas informações pessoais e de contato.
- **Registro de Dispositivos Rastreadores:** Registre os dispositivos utilizados para rastrear os veículos.
- **Gestão de IButtons:** Associe dispositivos de liberação do motorista (IButtons) aos motoristas para controle de acesso.
- **Histórico de Utilização:** Mantenha um registro completo das atividades e utilizações dos dispositivos ao longo do tempo.
- **Registro de Problemas de Comunicação:** Registre e acompanhe problemas de comunicação entre os veículos e o sistema de rastreamento.

## Tecnologias Utilizadas

- **Next.js 14:** Framework React para renderização do lado do servidor e do lado do cliente.
- **TypeScript:** Superset JavaScript que adiciona tipagem estática ao código.
- **Prisma ORM:** Interface de programação de banco de dados (ORM) moderna para Node.js e TypeScript.
- **MySQL:** Sistema de gerenciamento de banco de dados relacional.
- **Shadcd/ui:** Biblioteca de componentes para React.
- **React Toastify:** Biblioteca para notificações toasts em React.
- **Sweet Alert:** Biblioteca para criação de alertas personalizados.
- **Zod:** Validador de esquemas de objetos TypeScript.
- **Tailwind CSS:** Framework CSS utilitário de baixo nível.
- **JWT:** JSON Web Tokens para autenticação.
- **Axios:** Cliente HTTP baseado em Promises para o navegador e Node.js.
- **Bcrypt:** Biblioteca de hashing de senhas para segurança adicional.

## Como Executar o Projeto

1. **Clonando o repositório:**

   ```bash
   git clone https://github.com/micaelmi/star-tracking.git

   ```

2. **Instalação das Dependências:**

   ```bash
   npm i

   ```

3. **Execução:**

   ```bash
   npm run dev
   ```

4. **Deploy:**
   Dentro do servidor VPS, é utilzada a ferramenta pm2 para gerenciar o run de pacotes. Como esta aplicação é um mono-repo, basta rodar um comando de build e depois utilizar os comandos do pm2 listados abaixo.
   Mais informações em: https://pm2.keymetrics.io/.

   ```bash
   pm2 start --name "star-tracking" -p 3001

   pm2 restart star-tracking

   pm2 stop star-tracking

   pm2 delete star-tracking

   pm2 status
   ```

(Obs: é necessário configurar um banco de dados para rodar o projeto)
