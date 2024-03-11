import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  let users;
  if (!query) {
    users = await prisma.user.findMany({
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  } else {
    users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { username: { contains: query as string } },
        ],
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  }
  return NextResponse.json(users);
}
