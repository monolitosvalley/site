'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const OPPORTUNITY_TYPES = [
  'Vaga',
  'Investimento',
  'Mentoria',
  'Edital',
  'Parceria',
  'Bolsa',
  'Consultoria',
  'Capacitação',
]

export function OpportunityForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    deadline: '',
    image_url: '',
    application_url: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, 'opportunities', 'images')
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

      const { error } = await supabase.from('opportunities').insert({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        deadline: formData.deadline,
        image_url: formData.image_url,
        application_url: formData.application_url,
        active: true,
        approved: false,
      })

      if (error) throw error

      toast.success('Oportunidade criada com sucesso!')
      setFormData({
        title: '',
        description: '',
        type: '',
        deadline: '',
        image_url: '',
        application_url: '',
      })
      onSuccess()
    } catch (error) {
      toast.error('Erro ao criar oportunidade')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Oportunidade</CardTitle>
        <CardDescription>Crie uma nova oportunidade para a comunidade</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Título da oportunidade"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            placeholder="Descrição detalhada"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
          />
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de oportunidade" />
            </SelectTrigger>
            <SelectContent>
              {OPPORTUNITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
          <Input
            type="url"
            placeholder="Link de inscrição (ex: https://forms.google.com/...)"
            value={formData.application_url}
            onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Imagem da oportunidade</label>
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
            Criar Oportunidade
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
