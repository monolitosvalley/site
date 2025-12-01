import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from_date = searchParams.get("from_date")
    const to_date = searchParams.get("to_date")
    const limit = parseInt(searchParams.get("limit") || "50")

    const supabase = await createServiceClient()

    let query = supabase.from("events").select("*").eq("approved", true)

    // Apply date filters
    if (from_date) {
      query = query.gte("event_date", from_date)
    }

    if (to_date) {
      query = query.lte("event_date", to_date)
    }

    query = query.order("event_date", { ascending: true }).limit(limit)

    const { data, error } = await query

    if (error) {
      console.error("Events fetch error:", error)
      return NextResponse.json(
        { error: "Erro ao buscar eventos" },
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
