import { Driver } from "@prisma/client";

export interface DriverValues extends Driver {
  comments: string;
}
