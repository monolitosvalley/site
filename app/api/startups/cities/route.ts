import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServiceClient()
    
    // Select all cities for approved startups
    const { data, error } = await supabase
      .from("startups")
      .select("cidade")
      .eq("approved", true)

    if (error) {
      console.error("Error fetching cities:", error)
      return NextResponse.json({ error: "Erro ao buscar cidades" }, { status: 500 })
    }

    // Get unique cities, filter out null/empty values, and sort alphabetically
    const cities = Array.from(
      new Set(
        (data || [])
          .map((item) => item.cidade?.trim())
          .filter(Boolean)
      )
    ).sort()

    return NextResponse.json({ data: cities })
  } catch (error) {
    console.error("Unexpected error in GET cities:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
