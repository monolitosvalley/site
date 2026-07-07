import { createClient, createServiceClient } from "@/lib/supabase/server"
import { startupSchema } from "@/lib/validations/startup"
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

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const serviceClient = auth.serviceClient!
    const body = await request.json()
    const { owner_type, owner_id, invite_email, invite_name, startup: startupData } = body

    if (!startupData) {
      return NextResponse.json({ error: "Dados da startup são obrigatórios" }, { status: 400 })
    }

    // Validate startup data BEFORE inviting/creating users to avoid half-created state
    let validatedStartup;
    try {
      validatedStartup = startupSchema.parse(startupData)
    } catch (validationError: any) {
      const firstError = validationError.errors?.[0]
      return NextResponse.json(
        { error: firstError?.message || "Dados da startup são inválidos" },
        { status: 400 }
      )
    }

    let finalOwnerId = owner_id || null

    // 1. Handle Owner Linking/Inviting
    if (owner_type === "invite") {
      if (!invite_email || !invite_name) {
        return NextResponse.json({ error: "E-mail e nome são obrigatórios para enviar convite" }, { status: 400 })
      }

      // Check if user already exists in profiles
      const { data: existingProfile } = await serviceClient
        .from("profiles")
        .select("id")
        .eq("email", invite_email.trim().toLowerCase())
        .maybeSingle()

      if (existingProfile) {
        return NextResponse.json({ 
          error: "Um usuário com este e-mail já existe na plataforma. Por favor, selecione-o como usuário existente." 
        }, { status: 400 })
      }

      // Invite user via Supabase Auth Admin API
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      const { data: inviteData, error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
        invite_email.trim().toLowerCase(),
        {
          redirectTo: `${siteUrl}/auth/callback?next=/profile`,
          data: {
            full_name: invite_name.trim()
          }
        }
      )

      if (inviteError || !inviteData?.user) {
        console.error("Error inviting user:", inviteError)
        return NextResponse.json({ error: `Erro ao convidar usuário: ${inviteError?.message || 'Erro desconhecido'}` }, { status: 500 })
      }

      finalOwnerId = inviteData.user.id

      // Upsert profile record to make sure it's created immediately (avoiding delay in trigger)
      const { error: profileError } = await serviceClient
        .from("profiles")
        .upsert({
          id: finalOwnerId,
          email: invite_email.trim().toLowerCase(),
          full_name: invite_name.trim(),
          role: "user"
        })

      if (profileError) {
        console.error("Error upserting profile for invited user:", profileError)
        // Non-blocking, but log it
      }
    }

    // 2. Create Startup
    const { data, error: startupError } = await serviceClient
      .from("startups")
      .insert({
        ...validatedStartup,
        owner_id: finalOwnerId,
        approved: true // Automatically approved since it is created by admin
      })
      .select()
      .single()

    if (startupError) {
      console.error("Startup create error:", startupError)
      return NextResponse.json({ error: "Erro ao criar startup no banco de dados" }, { status: 500 })
    }

    return NextResponse.json({ success: true, startup: data })
  } catch (error) {
    console.error("Unexpected error in POST startups:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
