'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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
import { Loader2 } from 'lucide-react'
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    deadline: '',
  })
  const supabase = createClient()

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
        active: true,
        approved: false,
      })

      if (error) throw error

      toast.success('Oportunidade criada com sucesso!')
      setFormData({ title: '', description: '', type: '', deadline: '' })
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
            placeholder="Validade da oportunidade"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar Oportunidade
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
