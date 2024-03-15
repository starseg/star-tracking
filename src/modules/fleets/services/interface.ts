import { Fleet } from "@prisma/client";

export interface FleetProps extends Fleet {
  fleetContact: {
    fleetContactId: number;
    name: string;
    telephone: string;
  }[];
  fleetEmail: {
    fleetEmailId: number;
    email: string;
  }[];
}
