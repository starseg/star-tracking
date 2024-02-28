import { IButton, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const ibutton = await prisma.iButton.findFirst({
    where: { ibuttonId: id },
  });
  if (ibutton) {
    return NextResponse.json({ ibutton }, { status: 200 });
  }
  return NextResponse.json(
    { message: "ibutton não encontrado" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const ibutton = await prisma.iButton.delete({
    where: { ibuttonId: id },
  });
  if (ibutton) {
    return NextResponse.json({ ibutton }, { status: 200 });
  }
  return NextResponse.json(
    { message: "ibutton não encontrado" },
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
    .then(async (data: IButton) => {
      await prisma.iButton.update({
        where: { ibuttonId: id },
        data: {
          number: data.number,
          code: data.code,
          programmedField: data.programmedField,
          comments: data.comments,
          ibuttonStatusId: Number(data.ibuttonStatusId),
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
