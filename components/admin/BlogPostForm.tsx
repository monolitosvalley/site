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

export function BlogPostForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image_url: '',
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const url = await uploadImage(file, 'blog', 'images')
            setFormData({ ...formData, image_url: url })
            toast.success('Imagem enviada com sucesso!')
        } catch (error) {
            toast.error('Erro ao enviar imagem')
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

            const { error } = await supabase.from('blog_posts').insert({
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                content: formData.content,
                excerpt: formData.excerpt,
                image_url: formData.image_url,
                author_id: user.id,
                approved: false,
            })

            if (error) throw error

            toast.success('Post criado com sucesso!')
            setFormData({ title: '', slug: '', content: '', excerpt: '', image_url: '' })
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar post')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Post</CardTitle>
                <CardDescription>Crie um novo post para o blog</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Título do post"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Slug (deixe em branco para gerar automaticamente)"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <Textarea
                        placeholder="Resumo do post"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        required
                        rows={2}
                    />
                    <Textarea
                        placeholder="Conteúdo do post"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                        rows={6}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagem de capa</label>
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
                                {uploading ? 'Enviando...' : 'Selecionar imagem'}
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
                                ✓ Imagem selecionada
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={loading || uploading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Post
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
