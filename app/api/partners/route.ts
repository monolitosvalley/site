import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Partners fetch error:", error)
      return NextResponse.json(
        { error: "Erro ao buscar parceiros" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
