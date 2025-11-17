'use client'

import { useState } from 'react'
import { Profile } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, ProfileUpdate } from '@/lib/validations/profile'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
    profile: Profile
    onSuccess?: () => void
}

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileUpdate>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile.full_name || '',
            seeking_details: profile.seeking_details || '',
        },
    })

    const onSubmit = async (data: ProfileUpdate) => {
        setLoading(true)
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: data }),
            })

            if (!res.ok) {
                throw new Error('Erro ao atualizar perfil')
            }

            toast.success('Perfil atualizado com sucesso!')
            onSuccess?.()
        } catch (error) {
            toast.error('Erro ao atualizar perfil')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input id="full_name" {...register('full_name')} />
                {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
                <p className="text-sm text-muted-foreground">O email não pode ser alterado</p>
            </div>

            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Alterações
            </Button>
        </form>
    )
}
