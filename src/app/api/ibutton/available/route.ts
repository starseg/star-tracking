import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

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
