import { CreateEvent } from "../types/Event";
import { useCreate } from "../api/apiHelper";

export const useCreateEvent = () => {
  return useCreate<CreateEvent, unknown>("/events");
};
