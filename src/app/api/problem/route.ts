import { StringDateFormat } from "@/lib/utils";
import AuthService from "@/modules/auth/auth-service";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

interface ProblemData {
  vehicleId: number;
  date: Date;
  description: string;
  userId: number;
}

export async function POST(request: NextRequest) {
  const user = await AuthService.getPayload();
  return request
    .json()
    .then(async (data: ProblemData) => {
      if (user) {
        const problem = await prisma.comunicationProblem.create({
          data: {
            vehicleId: data.vehicleId,
          },
        });
        await prisma.comunicationDescription.create({
          data: {
            comunicationProblemId: problem.comunicationProblemId,
            userId: user.sub,
            description: data.description,
            date: StringDateFormat(data.date),
          },
        });
        return NextResponse.json({ data }, { status: 201 });
      }
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  let problems;
  if (!query) {
    problems = await prisma.comunicationProblem.findMany({
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            code: true,
            fleet: {
              select: {
                name: true,
              },
            }
          },
        },
        comunicationDescription: {
          select: {
            comunicationDescriptionId: true,
            description: true,
            date: true,
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: [{ date: "desc" }],
        },
      },
      orderBy: [{ status: "asc" }],
    });
  } else {
    problems = await prisma.comunicationProblem.findMany({
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            code: true,
            fleet: {
              select: {
                name: true,
              },
            }
          },
        },
        comunicationDescription: {
          select: {
            comunicationDescriptionId: true,
            description: true,
            date: true,
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: [{ date: "desc" }],
        },
      },
      where: {
        OR: [
          { vehicle: { licensePlate: { contains: query as string } } },
          { vehicle: { code: { contains: query as string } } },
          { vehicle: { fleet: { name: { contains: query as string } } } },
        ],
      },
      orderBy: [{ status: "asc" }],
    });
  }
  return NextResponse.json(problems);
}
