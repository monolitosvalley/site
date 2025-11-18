import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// PUT /api/team-members/[memberId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      full_name,
      photo_url,
      role,
      linkedin,
      github,
      behance,
      portfolio,
      lattes,
      instagram,
      outros
    } = body

    // Get team member to verify ownership
    const { data: member } = await supabase
      .from("team_members")
      .select("startup_id")
      .eq("id", memberId)
      .single()

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      )
    }

    // Verify user owns the startup
    const { data: startup } = await supabase
      .from("startups")
      .select("owner_id")
      .eq("id", member.startup_id)
      .single()

    if (!startup || startup.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update team member
    const { data, error } = await supabase
      .from("team_members")
      .update({
        full_name,
        photo_url,
        role,
        linkedin,
        github,
        behance,
        portfolio,
        lattes,
        instagram,
        outros
      })
      .eq("id", memberId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    )
  }
}

// DELETE /api/team-members/[memberId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get team member to verify ownership
    const { data: member } = await supabase
      .from("team_members")
      .select("startup_id")
      .eq("id", memberId)
      .single()

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      )
    }

    // Verify user owns the startup
    const { data: startup } = await supabase
      .from("startups")
      .select("owner_id")
      .eq("id", member.startup_id)
      .single()

    if (!startup || startup.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete team member
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    )
  }
}
