import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/team-members?startupId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startupId = searchParams.get("startupId")

    if (!startupId) {
      return NextResponse.json(
        { error: "startupId is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("startup_id", startupId)
      .order("position_order", { ascending: true })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}

// POST /api/team-members
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      startup_id,
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

    if (!startup_id || !full_name || !role) {
      return NextResponse.json(
        { error: "startup_id, full_name, and role are required" },
        { status: 400 }
      )
    }

    // Verify user owns the startup
    const { data: startup } = await supabase
      .from("startups")
      .select("owner_id")
      .eq("id", startup_id)
      .single()

    if (!startup || startup.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Insert team member
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        startup_id,
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
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    )
  }
}
