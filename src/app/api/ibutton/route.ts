import { IButton } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: IButton) => {
      await prisma.iButton.create({
        data: {
          number: data.number,
          comments: data.comments,
          code: data.code,
          programmedField: data.programmedField,
          url1: data.url1,
          url2: data.url2,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  let ibuttons;
  if (!query) {
    ibuttons = await prisma.iButton.findMany({
      include: { deviceStatus: true },
      orderBy: [{ deviceStatusId: "asc" }, { programmedField: "desc" }],
    });
  } else {
    ibuttons = await prisma.iButton.findMany({
      where: {
        OR: [
          { number: { contains: query as string } },
          { code: { contains: query as string } },
          { programmedField: { contains: query as string } },
          { comments: { contains: query as string } },
          { deviceStatus: { description: { contains: query as string } } },
        ],
      },
      include: { deviceStatus: true },
      orderBy: [{ deviceStatusId: "asc" }, { ibuttonId: "asc" }],
    });
  }
  return NextResponse.json(ibuttons);
}
