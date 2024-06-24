import { Programming } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const programming = await prisma.programming.findFirst({
    where: { programmingId: id },
  });
  if (programming) {
    return NextResponse.json({ programming }, { status: 200 });
  }
  return NextResponse.json(
    { message: "programming não encontrado" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const programming = await prisma.programming.delete({
    where: { programmingId: id },
  });
  if (programming) {
    return NextResponse.json({ programming }, { status: 200 });
  }
  return NextResponse.json(
    { message: "programming não encontrado" },
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
    .then(async (data: Programming) => {
      await prisma.programming.update({
        where: { programmingId: id },
        data: {
          text: data.text,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
