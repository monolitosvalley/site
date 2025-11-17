import { z } from "zod"

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100)
    .optional(),
  avatar_url: z.string().url().optional().nullable(),
  seeking_details: z
    .string()
    .max(500, "Máximo de 500 caracteres")
    .optional()
    .nullable()
})

export type ProfileUpdate = z.infer<typeof profileSchema>
