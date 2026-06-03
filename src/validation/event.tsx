import { z } from "zod";

const dateField = (message: string) =>
  z
    .union([z.string(), z.date()])
    .transform((val): Date => (val instanceof Date ? val : new Date(val)))
    .pipe(z.date({ message }));

export const createEventSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Event name must be at least 3 characters")
      .max(50, "Event name cannot exceed 50 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .or(z.literal("")),

    startingDate: dateField("Start date is required"),
    endingDate: dateField("End date is invalid").optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();

    if (data.startingDate.getTime() <= now.getTime()) {
      ctx.addIssue({
        code: "custom",
        message: "Start date must be in the future",
        path: ["startingDate"],
      });
    }

    if (
      data.endingDate &&
      data.endingDate.getTime() <= data.startingDate.getTime()
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after the start date",
        path: ["endingDate"],
      });
    }
  });
