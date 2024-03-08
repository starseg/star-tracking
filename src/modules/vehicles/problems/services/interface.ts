import { ComunicationProblem } from "@prisma/client";

export interface Problem extends ComunicationProblem {
  vehicle: {
    licensePlate: string;
    code: string;
  };
  comunicationDescription: {
    comunicationDescriptionId: number;
    date: Date;
    description: string;
    user: {
      userId: number;
      name: string;
    };
  }[];
}
