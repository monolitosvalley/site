import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const segmento = searchParams.get("segmento")
    const estagio_maturidade = searchParams.get("estagio_maturidade")
    const is_esg = searchParams.get("is_esg")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const supabase = await createServiceClient()

    let query = supabase.from("startups").select("*", { count: "exact" })

    // Apply filters
    if (segmento) {
      query = query.eq("segmento", segmento)
    }

    if (estagio_maturidade) {
      query = query.eq("estagio_maturidade", estagio_maturidade)
    }

    if (is_esg === "true") {
      query = query.eq("is_esg", true)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error("Startups fetch error:", error)
      return NextResponse.json(
        { error: "Erro ao buscar startups" },
        { status: 500 }
      )
    }

    const totalPages = count ? Math.ceil(count / limit) : 0

    return NextResponse.json({
      data,
      count,
      page,
      limit,
      totalPages
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
