import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, author:profiles(id, full_name, avatar_url)")
      .eq("slug", slug)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Post não encontrado" },
          { status: 404 }
        )
      }
      console.error("Blog post fetch error:", error)
      return NextResponse.json(
        { error: "Erro ao buscar post" },
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
