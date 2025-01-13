import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

interface StatusData {
  emphasis: boolean;
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);

  return request
    .json()
    .then(async (data: StatusData) => {
      await prisma.comunicationProblem.update({
        where: { comunicationProblemId: id },
        data: {
          emphasis: data.emphasis,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
