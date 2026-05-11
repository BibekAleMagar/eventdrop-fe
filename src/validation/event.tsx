import { z } from "zod";

export const CreateEventSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title is too long"),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .or(z.literal("")),

    startingDate: z
      .string()
      .min(1, "Starting date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

    endingDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.endingDate && data.startingDate) {
        return new Date(data.endingDate) >= new Date(data.startingDate);
      }
      return true;
    },
    {
      message: "End date must be after the start date",
      path: ["endingDate"],
    },
  );
