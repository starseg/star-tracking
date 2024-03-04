import AuthService from "@/modules/auth/auth-service";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface User {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: User) => {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
          status: "ACTIVE",
        },
      });
      if (!user) {
        return Response.json(
          { message: "Usuário não encontrado ou inativo" },
          { status: 401 }
        );
      }
      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        return Response.json({ message: "Senha incorreta" }, { status: 401 });
      }

      await AuthService.createSessionToken({
        sub: user.userId,
        name: user.name,
        type: user.type,
      });
      return Response.json({ status: 200 });
    })
    .catch((error) => {
      return Response.json({ error: error }, { status: 500 });
    });
}
