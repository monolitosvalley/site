import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const has_deadline = searchParams.get("has_deadline")

    const supabase = await createServiceClient()

    let query = supabase.from("opportunities").select("*")

    // Apply filters
    if (type) {
      query = query.eq("type", type)
    }

    if (has_deadline === "true") {
      query = query.not("deadline", "is", null)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Opportunities fetch error:", error)
      return NextResponse.json(
        { error: "Erro ao buscar oportunidades" },
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
