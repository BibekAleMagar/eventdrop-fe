import {z} from "zod";
import { createEventSchema } from "../validation/event";


export type Event = {
  id: string;
  name: string;
  description: string;
  eventCode: string;
  driveFolderId: string;
  driveFolderUrl: string;
  qrCodeUrl: string;
  startingDate: string; // ISO String from backend
  endingDate: string | null;
  hostId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateEvent = z.infer<typeof createEventSchema>;
export type CreateEventInput = z.input<typeof createEventSchema>;   // what the form holds
export type CreateEventOutput = z.output<typeof createEventSchema>;
