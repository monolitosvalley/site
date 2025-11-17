'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const code = searchParams.get('code')
        const type = searchParams.get('type')

        if (code) {
            const callbackUrl = `/auth/callback?code=${code}${type ? `&type=${type}` : ''}`
            router.replace(callbackUrl)
        }
    }, [searchParams, router])

    return null
}

export function AuthHashHandler() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const handleHashAuth = async () => {
            if (typeof window === 'undefined' || !window.location.hash) return

            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const accessToken = hashParams.get('access_token')
            const refreshToken = hashParams.get('refresh_token')

            if (accessToken && refreshToken) {
                try {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })

                    if (error) throw error

                    window.history.replaceState(null, '', window.location.pathname)
                    router.refresh()

                    setTimeout(() => {
                        router.push('/profile')
                    }, 100)
                } catch (error) {
                    console.error('Error setting session:', error)
                    router.push('/login?error=authentication_failed')
                }
            }
        }

        handleHashAuth()
    }, [router, supabase])

    return null
}
