import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const status = await prisma.deviceStatus.findMany();
  return NextResponse.json(status);
}