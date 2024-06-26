import { Declaration } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const declaration = await prisma.declaration.findFirst({
    where: { declarationId: id },
  });
  if (declaration) {
    return NextResponse.json({ declaration }, { status: 200 });
  }
  return NextResponse.json(
    { message: "declaração não encontrada" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const declaration = await prisma.declaration.delete({
    where: { declarationId: id },
  });
  if (declaration) {
    return NextResponse.json({ declaration }, { status: 200 });
  }
  return NextResponse.json(
    { message: "declaração não encontrada" },
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
    .then(async (data: Declaration) => {
      await prisma.declaration.update({
        where: { declarationId: id },
        data: {
          title: data.title,
          url: data.url,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
