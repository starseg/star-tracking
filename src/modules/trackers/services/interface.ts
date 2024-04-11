import { Tracker } from "@prisma/client";

export interface TrackerValues extends Tracker {
  comments: string;
}
