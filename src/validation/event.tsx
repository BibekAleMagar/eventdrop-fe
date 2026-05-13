import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title is too long"),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .or(z.literal("")),

    startingDate: z.coerce
      .date()
      .min(new Date(), "Starting date must be in the future"),

    endingDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.endingDate && data.startingDate) {
        return data.endingDate >= data.startingDate;
      }
      return true;
    },
    {
      message: "End date must be after the start date",
      path: ["endingDate"],
    },
  );
