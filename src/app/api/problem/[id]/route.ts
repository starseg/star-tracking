import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const comunicationProblem = await prisma.comunicationProblem.delete({
    where: { comunicationProblemId: id },
  });
  if (comunicationProblem) {
    return NextResponse.json({ comunicationProblem }, { status: 200 });
  }
  return NextResponse.json(
    { message: "problema não encontrado" },
    { status: 404 }
  );
}

interface StatusData {
  status: "ACTIVE" | "INACTIVE";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  console.log(id);

  return request
    .json()
    .then(async (data: StatusData) => {
      await prisma.comunicationProblem.update({
        where: { comunicationProblemId: id },
        data: {
          status: data.status,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
