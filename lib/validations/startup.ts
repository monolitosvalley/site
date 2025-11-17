import { z } from "zod"

export const startupSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100)
    .optional(),
  description: z.string().max(1000).optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  segmento: z.string().max(100).optional().nullable(),
  modelo_monetizacao: z.string().max(500).optional().nullable(),
  problema_abordado: z.string().max(1000).optional().nullable(),
  solucao_oferecida: z.string().max(1000).optional().nullable(),
  estagio_maturidade: z
    .enum(["Ideação", "Validação", "Operação", "Tração", "Scale-up"])
    .optional()
    .nullable(),
  programas_previos: z.string().max(500).optional().nullable(),
  tecnologias_utilizadas: z.array(z.string()).optional().default([]),
  links_premios_noticias: z.array(z.string().url()).optional().default([]),
  publico_atende: z.string().max(500).optional().nullable(),
  pitch_deck_url: z.string().url().optional().nullable(),
  is_esg: z.boolean().default(false),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable()
})

export type StartupUpdate = z.infer<typeof startupSchema>
