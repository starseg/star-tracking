import { ComunicationProblem } from "@prisma/client";

export interface Problem extends ComunicationProblem {
  vehicle: {
    licensePlate: string;
    code: string;
    fleet: {
      name: string;
    };
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
