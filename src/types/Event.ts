import {z} from "zod";
import { createEventSchema } from "../validation/event";


export type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    user: string;
    createdAt: string; 
    updatedAt: string;
}

export type CreateEvent = z.infer<typeof createEventSchema>;
export type CreateEventInput = z.input<typeof createEventSchema>;   // what the form holds
export type CreateEventOutput = z.output<typeof createEventSchema>;
