'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthHashHandler() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const handleHashAuth = async () => {
            // Check if there's a hash with auth tokens
            if (typeof window === 'undefined' || !window.location.hash) return

            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const accessToken = hashParams.get('access_token')
            const refreshToken = hashParams.get('refresh_token')
            const type = hashParams.get('type')

            if (accessToken && refreshToken) {
                try {
                    // Set session with tokens
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })

                    if (error) throw error

                    // Clear hash from URL
                    window.history.replaceState(null, '', window.location.pathname)

                    // Redirect based on type
                    if (type === 'invite' || type === 'recovery') {
                        router.push('/profile')
                    } else {
                        router.push('/profile')
                    }
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
