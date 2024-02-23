import { Fleet, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

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
      return Response.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return Response.json({ error: error }, { status: 500 });
    });
}

export async function GET() {
  const fleets = await prisma.fleet.findMany();
  return Response.json(fleets);
}

export async function DELETE(request: NextRequest) {
  // const fleets = await prisma.fleet.delete({
  //   where: {
  //     fleetId: id
  //   }
  // });
  // return Response.json(fleets);
}
