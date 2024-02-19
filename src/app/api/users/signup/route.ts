import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface User {
  name: string;
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: User) => {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      await prisma.user.create({
        data: {
          name: data.name,
          username: data.username,
          password: hashedPassword,
        },
      });
      return Response.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return Response.json({ error: error }, { status: 500 });
    });
}
