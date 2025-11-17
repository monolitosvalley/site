'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface SeekingFormProps {
    seekingDetails?: string | null
    onSuccess?: () => void
}

export function SeekingForm({ seekingDetails, onSuccess }: SeekingFormProps) {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(seekingDetails || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: {
                        seeking_details: value,
                    },
                }),
            })

            if (!res.ok) {
                throw new Error('Erro ao atualizar')
            }

            toast.success('Informações atualizadas com sucesso!')
            onSuccess?.()
        } catch (error) {
            toast.error('Erro ao atualizar informações')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const charCount = value.length
    const maxChars = 500

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="seeking_details">O que você está buscando?</Label>
                <Textarea
                    id="seeking_details"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ex: Busco investidores para minha startup de agritech, mentoria em vendas, parceiros para desenvolvimento de produto..."
                    rows={6}
                    maxLength={maxChars}
                />
                <p className="text-sm text-muted-foreground text-right">
                    {charCount}/{maxChars} caracteres
                </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Dicas:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Seja específico sobre o que você procura</li>
                    <li>Mencione sua área de atuação</li>
                    <li>Indique se busca investimento, mentoria, parceiros, etc.</li>
                </ul>
            </div>

            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Alterações
            </Button>
        </form>
    )
}
