import { Fleet, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: Fleet) => {
      await prisma.fleet.create({
        data: {
          name: data.name,
          responsible: data.responsible,
          telephone: data.telephone,
          email: data.email,
          color: data.color,
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
  let fleets;
  if (!query) {
    fleets = await prisma.fleet.findMany({
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  } else {
    fleets = await prisma.fleet.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { responsible: { contains: query as string } },
          { telephone: { contains: query as string } },
          { email: { contains: query as string } },
        ],
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  }
  return NextResponse.json(fleets);
}
