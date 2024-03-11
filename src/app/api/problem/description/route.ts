import { StringDateFormat } from "@/lib/utils";
import AuthService from "@/modules/auth/auth-service";
import { ComunicationDescription } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  const user = await AuthService.getPayload();
  return request
    .json()
    .then(async (data: ComunicationDescription) => {
      if (user) {
        const problem = await prisma.comunicationDescription.create({
          data: {
            comunicationProblemId: data.comunicationProblemId,
            userId: user.sub,
            description: data.description,
            date: StringDateFormat(data.date),
          },
        });
        return NextResponse.json({ problem }, { status: 201 });
      }
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
