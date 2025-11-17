'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthConfirmPage() {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get hash from URL (for invite links)
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')
                const type = hashParams.get('type')

                if (accessToken && refreshToken) {
                    // Set session with tokens
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })

                    if (error) throw error

                    // If it's an invite, redirect to profile to complete setup
                    if (type === 'invite') {
                        router.push('/profile')
                    } else {
                        router.push('/profile')
                    }
                } else {
                    throw new Error('Tokens não encontrados')
                }
            } catch (err: any) {
                console.error('Auth error:', err)
                setError(err.message || 'Erro ao autenticar')
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            }
        }

        handleAuthCallback()
    }, [router, supabase])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-600 mb-2">{error}</p>
                    <p className="text-sm text-muted-foreground">Redirecionando para login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Autenticando...</p>
            </div>
        </div>
    )
}
