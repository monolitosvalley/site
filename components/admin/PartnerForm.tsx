'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function PartnerForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        image_url: '',
        category: '',
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const url = await uploadImage(file, 'partners', 'logos')
            setFormData({ ...formData, image_url: url })
            toast.success('Logo enviado com sucesso!')
        } catch (error) {
            toast.error('Erro ao enviar logo')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            const { error } = await supabase.from('partners').insert({
                name: formData.name,
                description: formData.description,
                website: formData.website,
                image_url: formData.image_url,
                category: formData.category,
                approved: false,
            })

            if (error) throw error

            toast.success('Parceiro criado com sucesso!')
            setFormData({ name: '', description: '', website: '', image_url: '', category: '' })
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar parceiro')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Parceiro</CardTitle>
                <CardDescription>Crie um novo parceiro para a comunidade</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Nome do parceiro"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Textarea
                        placeholder="Descrição do parceiro"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                    />
                    <Input
                        placeholder="Categoria (ex: Tecnologia, Consultoria, Investimento)"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Logo do parceiro</label>
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? 'Enviando...' : 'Selecionar logo'}
                            </Button>
                            {formData.image_url && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, image_url: '' })}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {formData.image_url && (
                            <p className="text-xs text-muted-foreground truncate">
                                ✓ Logo selecionado
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={loading || uploading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Parceiro
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
