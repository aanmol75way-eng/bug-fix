import { z } from "zod";

export const registerSchema = z.object({
    userName: z.string().min(2, "Name must be at least 2 characters"),
    userEmail: z.string().email("Invalid email"),
    userPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type registerInput = z.infer<typeof registerSchema>;