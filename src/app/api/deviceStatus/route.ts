import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(request: NextRequest) {
  const status = await prisma.deviceStatus.findMany();
  return NextResponse.json(status);
}
