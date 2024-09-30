import { z } from "zod";

export const userIdSchema = z.number().min(1);

export const userCreateSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email(),
});
