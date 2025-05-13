import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Nieprawidłowy format adresu email"),
  password: z
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .max(72, "Hasło nie może być dłuższe niż 72 znaki"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
