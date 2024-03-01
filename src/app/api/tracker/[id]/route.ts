import { Tracker, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const tracker = await prisma.tracker.findFirst({
    where: { trackerId: id },
  });
  if (tracker) {
    return NextResponse.json({ tracker }, { status: 200 });
  }
  return NextResponse.json(
    { message: "rastreador não encontrado" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const tracker = await prisma.tracker.delete({
    where: { trackerId: id },
  });
  if (tracker) {
    return NextResponse.json({ tracker }, { status: 200 });
  }
  return NextResponse.json(
    { message: "rastreador não encontrado" },
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
    .then(async (data: Tracker) => {
      await prisma.tracker.update({
        where: { trackerId: id },
        data: {
          number: data.number,
          model: data.model,
          chipOperator: data.chipOperator,
          iccid: data.iccid,
          output: data.output,
          deviceStatusId: Number(data.deviceStatusId),
          comments: data.comments,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
