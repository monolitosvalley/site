'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Key } from 'lucide-react'

export function SecurityForm() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' })
            setLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' })
            setLoading(false)
            return
        }

        try {
            // Primeiro, reautenticar o usuário com a senha atual
            const { data: { user } } = await supabase.auth.getUser()

            if (!user?.email) {
                throw new Error('Usuário não encontrado')
            }

            // Tentar fazer login com a senha atual para validar
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })

            if (signInError) {
                throw new Error('Senha atual incorreta')
            }

            // Atualizar para a nova senha
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (updateError) throw updateError

            setMessage({
                type: 'success',
                text: 'Senha alterada com sucesso!',
            })

            // Limpar campos
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Erro ao alterar senha',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleteLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('Usuário não encontrado')
            }

            // Deletar o perfil do usuário (isso vai cascatear para startups devido ao ON DELETE CASCADE)
            const { error: deleteError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', user.id)

            if (deleteError) throw deleteError

            // Fazer logout
            await supabase.auth.signOut()

            // Redirecionar para home
            router.push('/')
            router.refresh()
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Erro ao deletar conta',
            })
            setDeleteLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Alterar Senha */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Alterar Senha
                    </CardTitle>
                    <CardDescription>
                        Atualize sua senha para manter sua conta segura
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha Atual</Label>
                            <Input
                                id="current-password"
                                type="password"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
                            <Input
                                id="confirm-new-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </Button>
                    </form>

                    {message && (
                        <div
                            className={`mt-4 rounded-md p-3 text-sm ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800'
                                    : 'bg-red-50 text-red-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Deletar Conta */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Zona de Perigo
                    </CardTitle>
                    <CardDescription>
                        Ações irreversíveis que afetam permanentemente sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={deleteLoading}>
                                {deleteLoading ? 'Deletando...' : 'Deletar Minha Conta'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua
                                    conta, perfil, startup e todos os dados associados.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Sim, deletar minha conta
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    )
}
