import { z } from "zod"

// Schema mais flexível - todos os campos opcionais
export const profileSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "📝 Nome deve ter pelo menos 2 caracteres")
      .optional()
      .or(z.literal("")),
    bio: z
      .string()
      .max(500, "📝 Bio deve ter no máximo 500 caracteres")
      .optional()
      .or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    linkedin: z
      .string()
      .refine(
        (val) => !val || val === "" || val.startsWith("http"),
        "🔗 LinkedIn: Insira uma URL válida (ex: https://linkedin.com/in/seu-perfil)"
      )
      .optional()
      .or(z.literal("")),
    avatar_url: z
      .string()
      .refine(
        (val) => !val || val === "" || val.startsWith("http"),
        "🖼️ Avatar: URL inválida"
      )
      .optional()
      .or(z.literal(""))
  })
  .partial()

export const seekingSchema = z.object({
  seeking_details: z
    .string()
    .max(1000, "📝 Detalhes devem ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal(""))
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type SeekingFormData = z.infer<typeof seekingSchema>
