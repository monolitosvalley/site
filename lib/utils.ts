import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "")
  if (cleaned.length !== 14) return cnpj
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  )
}

export function maskCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const limited = cleaned.slice(0, 14)

  if (limited.length <= 2) return limited
  if (limited.length <= 5) return `${limited.slice(0, 2)}.${limited.slice(2)}`
  if (limited.length <= 8)
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`
  if (limited.length <= 12)
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(
      5,
      8
    )}/${limited.slice(8)}`
  return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(
    5,
    8
  )}/${limited.slice(8, 12)}-${limited.slice(12)}`
}
