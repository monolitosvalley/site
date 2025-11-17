import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const supabase = await createServiceClient()

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from("blog_posts")
      .select("*, author:profiles(id, full_name, avatar_url)", {
        count: "exact"
      })
      .range(from, to)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Blog posts fetch error:", error)
      return NextResponse.json(
        { error: "Erro ao buscar posts" },
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
