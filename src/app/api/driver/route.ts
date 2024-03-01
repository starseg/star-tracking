import { Driver, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: Driver) => {
      await prisma.driver.create({
        data: {
          name: data.name,
          cpf: data.cpf,
          cnh: data.cnh,
          comments: data.comments,
          fleetId: data.fleetId,
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
  let drivers;
  if (!query) {
    drivers = await prisma.driver.findMany({
      include: { fleet: true },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  } else {
    drivers = await prisma.driver.findMany({
      include: { fleet: true },
      where: {
        OR: [
          { name: { contains: query as string } },
          { cpf: { contains: query as string } },
          { cnh: { contains: query as string } },
          { fleet: { name: { contains: query as string } } },
        ],
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  }
  return NextResponse.json(drivers);
}
