import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(request: NextRequest) {
  const trackers = await prisma.tracker.findMany({
    where: {
      deviceStatusId: 1,
    },
    include: { deviceStatus: true },
    orderBy: [{ deviceStatusId: "asc" }, { trackerId: "asc" }],
  });
  return NextResponse.json(trackers);
}
