'use client'

import { useState, useEffect } from 'react'
import { Profile, Startup } from '@/types/database'
import { ProfileForm } from '@/components/features/profile/ProfileForm'
import { AvatarUpload } from '@/components/features/profile/AvatarUpload'
import { SeekingForm } from '@/components/features/profile/SeekingForm'
import { StartupForm } from '@/components/features/startups/StartupForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'sonner'

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [startup, setStartup] = useState<Startup | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile')
            if (res.ok) {
                const data = await res.json()
                setProfile(data.profile)
                setStartup(data.startup)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleAvatarUpload = async (url: string) => {
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: {
                        avatar_url: url,
                    },
                }),
            })

            if (res.ok) {
                fetchProfile()
            }
        } catch (error) {
            console.error('Error updating avatar:', error)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-muted-foreground">Erro ao carregar perfil</p>
            </div>
        )
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Meu Perfil</h1>
                    <p className="text-muted-foreground">Gerencie suas informações e sua startup</p>
                </div>

                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="info">Minhas Informações</TabsTrigger>
                        <TabsTrigger value="startup">Minha Startup</TabsTrigger>
                        <TabsTrigger value="seeking">Oportunidades</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Avatar</CardTitle>
                                    <CardDescription>Sua foto de perfil</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AvatarUpload
                                        currentUrl={profile.avatar_url}
                                        userName={profile.full_name || undefined}
                                        onUploadComplete={handleAvatarUpload}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Informações Pessoais</CardTitle>
                                    <CardDescription>Atualize seus dados básicos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProfileForm profile={profile} onSuccess={fetchProfile} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="startup" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações da Startup</CardTitle>
                                <CardDescription>
                                    {startup
                                        ? 'Atualize as informações da sua startup'
                                        : 'Cadastre sua startup na comunidade'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <StartupForm startup={startup} onSuccess={fetchProfile} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seeking" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>O que você está buscando?</CardTitle>
                                <CardDescription>
                                    Compartilhe com a comunidade o que você procura: investimento, mentoria, parceiros,
                                    etc.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SeekingForm seekingDetails={profile.seeking_details} onSuccess={fetchProfile} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
