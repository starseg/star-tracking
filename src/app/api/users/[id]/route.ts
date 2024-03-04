import { User, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const user = await prisma.user.findFirst({
    where: { userId: id },
  });
  if (user) {
    return NextResponse.json({ user }, { status: 200 });
  }
  return NextResponse.json(
    { message: "usuário não encontrado" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const user = await prisma.user.delete({
    where: { userId: id },
  });
  if (user) {
    return NextResponse.json({ user }, { status: 200 });
  }
  return NextResponse.json(
    { message: "usuário não encontrado" },
    { status: 404 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  return request
    .json()
    .then(async (data: User) => {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await prisma.user.update({
        where: { userId: id },
        data: {
          name: data.name,
          username: data.username,
          password: hashedPassword,
          type: data.type,
          status: data.status,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
