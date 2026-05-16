import { CreateEvent } from "../types/Event";
import { useCreate, useFetch } from "../api/apiHelper";
import { Event } from "../types/Event";

export const useCreateEvent = () => {
  return useCreate<CreateEvent, unknown>("/events", ["myEvents"]);
};

export const useMyEvents = () => {
  return useFetch<Event[]>(["myEvents"], "/events/my-events");
};
