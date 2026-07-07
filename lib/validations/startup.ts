import { z } from "zod"

export const startupSchema = z.object({
  name: z.string().min(2, "O nome da startup deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(
      10,
      "A descrição deve ter pelo menos 10 caracteres para ajudar outros a entenderem sua startup"
    ),
  segmento: z.string().min(1, "Por favor, selecione o segmento da sua startup"),
  estagio_maturidade: z.enum([
    "ideia",
    "validacao",
    "mvp",
    "tracao",
    "escala",
    "crescimento"
  ]),
  ano_fundacao: z
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear(), "O ano não pode ser no futuro"),
  website: z
    .string()
    .url("Digite uma URL válida (ex: https://seusite.com)")
    .optional()
    .nullable()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Digite uma URL válida do LinkedIn")
    .optional()
    .nullable()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Digite uma URL válida do Instagram")
    .optional()
    .nullable()
    .or(z.literal("")),
  cidade: z
    .string()
    .min(1, "Informe a cidade onde sua startup está localizada"),
  estado: z.string().length(2, "Digite a sigla do estado (ex: CE, SP, RJ)"),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  tecnologias: z.array(z.string()).optional().nullable(),
  tem_esg: z.boolean().default(false),
  detalhes_esg: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable().or(z.literal("")),
  logo_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  pitch_deck_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  banner_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  programas_investimentos: z.string().optional().nullable().or(z.literal(""))
})

export type StartupFormData = z.infer<typeof startupSchema>
