import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { error: "Não autenticado", status: 401 }
  }

  const serviceClient = await createServiceClient()
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: "Acesso negado", status: 403 }
  }

  return { user, serviceClient }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const {
      full_name,
      email,
      role_title,
      startup_name,
      linkedin_url,
      instagram_url,
      photo_url,
      profile_id,
      checklist,
      monthly_engagement
    } = body

    const updateData: any = {}
    if (full_name !== undefined) updateData.full_name = full_name
    if (email !== undefined) updateData.email = email || null
    if (role_title !== undefined) updateData.role_title = role_title
    if (startup_name !== undefined) updateData.startup_name = startup_name || null
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url || null
    if (instagram_url !== undefined) updateData.instagram_url = instagram_url || null
    if (photo_url !== undefined) updateData.photo_url = photo_url || null
    if (profile_id !== undefined) updateData.profile_id = profile_id || null
    if (checklist !== undefined) updateData.checklist = checklist
    if (monthly_engagement !== undefined) updateData.monthly_engagement = monthly_engagement

    updateData.updated_at = new Date().toISOString()

    const { data: leader, error: updateError } = await auth.serviceClient!
      .from("community_leaders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Leaders update error:", updateError)
      return NextResponse.json({ error: "Erro ao atualizar liderança" }, { status: 500 })
    }

    return NextResponse.json({ data: leader })
  } catch (error) {
    console.error("Unexpected error in PUT leader:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { error: deleteError } = await auth.serviceClient!
      .from("community_leaders")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Leaders delete error:", deleteError)
      return NextResponse.json({ error: "Erro ao deletar liderança" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in DELETE leader:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
