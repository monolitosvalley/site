'use client'

import { useState } from 'react'
import { Startup } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { startupSchema, StartupUpdate } from '@/lib/validations/startup'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface StartupFormProps {
    startup?: Startup | null
    onSuccess?: () => void
}

const SEGMENTOS = [
    'Agritech',
    'Edtech',
    'Fintech',
    'Healthtech',
    'Retailtech',
    'Logística',
    'Energia',
    'Outro',
]

const ESTAGIOS = ['Ideação', 'Validação', 'Operação', 'Tração', 'Scale-up'] as const

export function StartupForm({ startup, onSuccess }: StartupFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingPitch, setUploadingPitch] = useState(false)
    const [logoUrl, setLogoUrl] = useState(startup?.logo_url || '')
    const [pitchDeckUrl, setPitchDeckUrl] = useState(startup?.pitch_deck_url || '')
    const [technologies, setTechnologies] = useState<string[]>(startup?.tecnologias_utilizadas || [])
    const [links, setLinks] = useState<string[]>(startup?.links_premios_noticias || [])
    const [newTech, setNewTech] = useState('')
    const [newLink, setNewLink] = useState('')

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            name: startup?.name || '',
            description: startup?.description || '',
            segmento: startup?.segmento || '',
            modelo_monetizacao: startup?.modelo_monetizacao || '',
            problema_abordado: startup?.problema_abordado || '',
            solucao_oferecida: startup?.solucao_oferecida || '',
            estagio_maturidade: startup?.estagio_maturidade || undefined,
            programas_previos: startup?.programas_previos || '',
            publico_atende: startup?.publico_atende || '',
            is_esg: startup?.is_esg || false,
            latitude: startup?.latitude || undefined,
            longitude: startup?.longitude || undefined,
            tecnologias_utilizadas: [],
            links_premios_noticias: [],
        },
    })

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingLogo(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'logos')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Erro ao fazer upload')

            const data = await res.json()
            setLogoUrl(data.url)

            // Save logo immediately
            const saveRes = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: { logo_url: data.url },
                }),
            })

            if (saveRes.ok) {
                toast.success('Logo enviado com sucesso!')
                onSuccess?.()
            } else {
                throw new Error('Erro ao salvar logo')
            }
        } catch (error) {
            toast.error('Erro ao enviar logo')
            console.error(error)
        } finally {
            setUploadingLogo(false)
        }
    }

    const handlePitchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingPitch(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'pitch-decks')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Erro ao fazer upload')

            const data = await res.json()
            setPitchDeckUrl(data.url)

            // Save pitch deck immediately
            const saveRes = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: { pitch_deck_url: data.url },
                }),
            })

            if (saveRes.ok) {
                toast.success('Pitch deck enviado com sucesso!')
                onSuccess?.()
            } else {
                throw new Error('Erro ao salvar pitch deck')
            }
        } catch (error) {
            toast.error('Erro ao enviar pitch deck')
            console.error(error)
        } finally {
            setUploadingPitch(false)
        }
    }

    const addTechnology = () => {
        if (newTech.trim() && !technologies.includes(newTech.trim())) {
            setTechnologies([...technologies, newTech.trim()])
            setNewTech('')
        }
    }

    const removeTechnology = (tech: string) => {
        setTechnologies(technologies.filter((t) => t !== tech))
    }

    const addLink = () => {
        if (newLink.trim() && !links.includes(newLink.trim())) {
            try {
                new URL(newLink.trim())
                setLinks([...links, newLink.trim()])
                setNewLink('')
            } catch {
                toast.error('URL inválida')
            }
        }
    }

    const removeLink = (link: string) => {
        setLinks(links.filter((l) => l !== link))
    }

    const onSubmit = async (data: StartupUpdate) => {
        setLoading(true)
        try {
            const startupData = {
                ...data,
                logo_url: logoUrl || null,
                pitch_deck_url: pitchDeckUrl || null,
                tecnologias_utilizadas: technologies,
                links_premios_noticias: links,
            }

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startup: startupData }),
            })

            if (!res.ok) {
                throw new Error('Erro ao salvar startup')
            }

            toast.success('Startup salva com sucesso!')
            onSuccess?.()
        } catch (error) {
            toast.error('Erro ao salvar startup')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
                <Label>Logo da Startup</Label>
                <div className="flex items-center gap-4">
                    {logoUrl && (
                        <Image src={logoUrl} alt="Logo" width={80} height={80} className="rounded-lg object-cover" />
                    )}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={uploadingLogo}
                        >
                            {uploadingLogo ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {logoUrl ? 'Alterar Logo' : 'Enviar Logo'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Startup *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...register('description')} rows={4} />
                {errors.description && <p className="text-sm text-destructive">{String(errors.description.message)}</p>}
            </div>

            {/* Segmento */}
            <div className="space-y-2">
                <Label htmlFor="segmento">Segmento</Label>
                <Controller
                    name="segmento"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um segmento" />
                            </SelectTrigger>
                            <SelectContent>
                                {SEGMENTOS.map((seg) => (
                                    <SelectItem key={seg} value={seg}>
                                        {seg}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Estágio de Maturidade */}
            <div className="space-y-2">
                <Label htmlFor="estagio_maturidade">Estágio de Maturidade</Label>
                <Controller
                    name="estagio_maturidade"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um estágio" />
                            </SelectTrigger>
                            <SelectContent>
                                {ESTAGIOS.map((est) => (
                                    <SelectItem key={est} value={est}>
                                        {est}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Modelo de Monetização */}
            <div className="space-y-2">
                <Label htmlFor="modelo_monetizacao">Modelo de Monetização</Label>
                <Textarea id="modelo_monetizacao" {...register('modelo_monetizacao')} rows={3} />
            </div>

            {/* Problema Abordado */}
            <div className="space-y-2">
                <Label htmlFor="problema_abordado">Problema Abordado</Label>
                <Textarea id="problema_abordado" {...register('problema_abordado')} rows={3} />
            </div>

            {/* Solução Oferecida */}
            <div className="space-y-2">
                <Label htmlFor="solucao_oferecida">Solução Oferecida</Label>
                <Textarea id="solucao_oferecida" {...register('solucao_oferecida')} rows={3} />
            </div>

            {/* Público Atende */}
            <div className="space-y-2">
                <Label htmlFor="publico_atende">Público que Atende</Label>
                <Textarea id="publico_atende" {...register('publico_atende')} rows={2} />
            </div>

            {/* Programas Prévios */}
            <div className="space-y-2">
                <Label htmlFor="programas_previos">Programas de Aceleração/Incubação</Label>
                <Textarea
                    id="programas_previos"
                    {...register('programas_previos')}
                    placeholder="Ex: Startup Brasil, Inovativa Brasil..."
                    rows={2}
                />
            </div>

            {/* Tecnologias */}
            <div className="space-y-2">
                <Label>Tecnologias Utilizadas</Label>
                <div className="flex gap-2">
                    <Input
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        placeholder="Ex: React, Python, AWS..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                        Adicionar
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech) => (
                        <div key={tech} className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-sm">{tech}</span>
                            <button type="button" onClick={() => removeTechnology(tech)}>
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
                <Label>Links de Prêmios/Notícias</Label>
                <div className="flex gap-2">
                    <Input
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        placeholder="https://..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    />
                    <Button type="button" onClick={addLink} variant="outline">
                        Adicionar
                    </Button>
                </div>
                <div className="space-y-2 mt-2">
                    {links.map((link) => (
                        <div key={link} className="bg-secondary px-3 py-2 rounded flex items-center justify-between">
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm truncate flex-1">
                                {link}
                            </a>
                            <button type="button" onClick={() => removeLink(link)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pitch Deck */}
            <div className="space-y-2">
                <Label>Pitch Deck (PDF)</Label>
                <div className="flex items-center gap-4">
                    {pitchDeckUrl && startup?.owner_id && (
                        <a
                            href={`/api/pitch-deck/${startup.owner_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                        >
                            Ver pitch deck atual
                        </a>
                    )}
                    <div>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePitchUpload}
                            className="hidden"
                            id="pitch-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('pitch-upload')?.click()}
                            disabled={uploadingPitch}
                        >
                            {uploadingPitch ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {pitchDeckUrl ? 'Alterar Pitch Deck' : 'Enviar Pitch Deck'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ESG */}
            <div className="flex items-center space-x-2">
                <Controller
                    name="is_esg"
                    control={control}
                    render={({ field }) => (
                        <Checkbox id="is_esg" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                />
                <Label htmlFor="is_esg" className="cursor-pointer">
                    Startup com foco em ESG (Ambiental, Social e Governança)
                </Label>
            </div>

            {/* Localização */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                        id="latitude"
                        type="number"
                        step="any"
                        {...register('latitude', { valueAsNumber: true })}
                    />
                    {errors.latitude && <p className="text-sm text-destructive">{String(errors.latitude.message)}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                        id="longitude"
                        type="number"
                        step="any"
                        {...register('longitude', { valueAsNumber: true })}
                    />
                    {errors.longitude && <p className="text-sm text-destructive">{String(errors.longitude.message)}</p>}
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Startup
            </Button>
        </form>
    )
}
