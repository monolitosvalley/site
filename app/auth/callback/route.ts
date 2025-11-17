import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")
  const next = requestUrl.searchParams.get("next") || "/profile"

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash
    })

    if (!error) {
      // Se for recovery, vai para reset-password
      if (type === "recovery" || type === "email_change") {
        return NextResponse.redirect(
          new URL("/reset-password", requestUrl.origin)
        )
      }
      // Se for magiclink, vai para o next ou profile
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  return NextResponse.redirect(
    new URL("/auth/login?error=authentication_failed", requestUrl.origin)
  )
}
