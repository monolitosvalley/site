'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminStartupForm } from '@/components/admin/AdminStartupForm'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function NewStartupPage() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function checkAdmin() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role !== 'admin') {
                    router.push('/')
                    toast.error('Acesso negado')
                    return
                }

                setIsAdmin(true)
            } catch (error) {
                console.error(error)
                toast.error('Erro de autenticação')
                router.push('/')
            } finally {
                setLoading(false)
            }
        }

        checkAdmin()
    }, [router, supabase])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!isAdmin) return null

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/admin')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-4xl font-bold mb-2">Cadastrar Nova Startup</h1>
                    <p className="text-muted-foreground">Adicione uma startup e vincule ou convide o proprietário.</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-6 md:p-8">
                <AdminStartupForm />
            </div>
        </div>
    )
}
