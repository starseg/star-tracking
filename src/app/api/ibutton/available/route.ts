import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const ibuttons = await prisma.iButton.findMany({
    where: {
      deviceStatusId: 1,
    },
    include: { deviceStatus: true },
    orderBy: [{ deviceStatusId: "asc" }, { ibuttonId: "asc" }],
  });
  return NextResponse.json(ibuttons);
}
