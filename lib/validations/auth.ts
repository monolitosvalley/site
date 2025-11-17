import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
})

export const magicLinkSchema = z.object({
  email: z.string().email("Email inválido")
})

export type LoginFormData = z.infer<typeof loginSchema>
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>
