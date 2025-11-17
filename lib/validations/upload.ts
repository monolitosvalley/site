import { z } from "zod"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]
const ACCEPTED_PDF_TYPE = "application/pdf"

export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      "Imagem deve ter no máximo 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formato deve ser JPEG, PNG ou WebP"
    ),
  bucket: z.enum(["avatars", "logos", "events", "blog", "products"])
})

export const pdfUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_PDF_SIZE, "PDF deve ter no máximo 10MB")
    .refine((file) => file.type === ACCEPTED_PDF_TYPE, "Arquivo deve ser PDF"),
  bucket: z.literal("pitch-decks")
})

export const uploadSchema = z.union([imageUploadSchema, pdfUploadSchema])

export type ImageUpload = z.infer<typeof imageUploadSchema>
export type PdfUpload = z.infer<typeof pdfUploadSchema>
export type Upload = z.infer<typeof uploadSchema>
