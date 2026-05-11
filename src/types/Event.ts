import {z} from "zod";
import { CreateEventSchema } from "../validation/event";


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

export type CreateEvent = z.infer<typeof CreateEventSchema>;
