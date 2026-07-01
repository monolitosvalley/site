'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { Loader2, Upload, X, Search, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const LocationPicker = dynamic(
    () => import('../features/startups/LocationPicker').then((mod) => ({ default: mod.LocationPicker })),
    { ssr: false, loading: () => <div className="h-[200px] bg-muted animate-pulse rounded-lg" /> }
)

const SEGMENTOS = [
    'Agritech',
    'Socialtech',
    'Edtech',
    'Fintech',
    'Healthtech',
    'Retailtech',
    'Logística',
    'Energia',
    'Mobilidade',
    'Turismo',
    'Alimentação',
    'Moda',
    'Construção',
    'Manufatura',
    'Serviços',
    'Outro',
]

const ESTAGIOS = [
    { value: 'ideia', label: 'Ideação' },
    { value: 'validacao', label: 'Validação' },
    { value: 'mvp', label: 'MVP' },
    { value: 'tracao', label: 'Tração' },
    { value: 'escala', label: 'Escala' },
    { value: 'crescimento', label: 'Crescimento' },
] as const

interface ProfileOption {
    id: string
    full_name: string | null
    email: string
}

export function AdminStartupForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [profilesLoading, setProfilesLoading] = useState(true)
    const [profiles, setProfiles] = useState<ProfileOption[]>([])
    const [filteredProfiles, setFilteredProfiles] = useState<ProfileOption[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    
    // Form Owner settings
    const [ownerType, setOwnerType] = useState<'existing' | 'invite'>('existing')
    const [selectedOwnerId, setSelectedOwnerId] = useState('')
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteName, setInviteName] = useState('')

    // Startup files & extras
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [uploadingPitch, setUploadingPitch] = useState(false)
    const [logoUrl, setLogoUrl] = useState('')
    const [bannerUrl, setBannerUrl] = useState('')
    const [pitchDeckUrl, setPitchDeckUrl] = useState('')
    const [technologies, setTechnologies] = useState<string[]>([])
    const [newTech, setNewTech] = useState('')
    const [latitude, setLatitude] = useState<number | undefined>(undefined)
    const [longitude, setLongitude] = useState<number | undefined>(undefined)
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            name: '',
            description: '',
            segmento: '',
            estagio_maturidade: undefined,
            ano_fundacao: new Date().getFullYear(),
            website: '',
            linkedin: '',
            instagram: '',
            cidade: '',
            estado: '',
            cnpj: '',
            tem_esg: false,
            programas_investimentos: '',
        },
    })

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const res = await fetch('/api/admin/profiles')
                if (!res.ok) throw new Error('Erro ao carregar perfis')
                const data = await res.json()
                setProfiles(data.data || [])
                setFilteredProfiles(data.data || [])
            } catch (error) {
                console.error(error)
                toast.error('Erro ao carregar lista de usuários')
            } finally {
                setProfilesLoading(false)
            }
        }
        fetchProfiles()
    }, [])

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim()
        if (!query) {
            setFilteredProfiles(profiles)
        } else {
            setFilteredProfiles(
                profiles.filter(
                    (p) =>
                        p.email.toLowerCase().includes(query) ||
                        (p.full_name && p.full_name.toLowerCase().includes(query))
                )
            )
        }
    }, [searchQuery, profiles])

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
            toast.success('Logo enviado com sucesso!')
        } catch (error) {
            toast.error('Erro ao enviar logo')
            console.error(error)
        } finally {
            setUploadingLogo(false)
        }
    }

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingBanner(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'banners')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Erro ao fazer upload')

            const data = await res.json()
            setBannerUrl(data.url)
            toast.success('Banner enviado com sucesso!')
        } catch (error) {
            toast.error('Erro ao enviar banner')
            console.error(error)
        } finally {
            setUploadingBanner(false)
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
            toast.success('Pitch deck enviado com sucesso!')
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

    const onSubmit = async (data: any) => {
        if (ownerType === 'existing' && !selectedOwnerId) {
            toast.error('Por favor, selecione o dono da startup')
            return
        }

        if (ownerType === 'invite' && (!inviteEmail || !inviteName)) {
            toast.error('Por favor, preencha o e-mail e o nome para o convite')
            return
        }

        setLoading(true)
        try {
            const startupData = {
                ...data,
                logo_url: logoUrl || null,
                banner_url: bannerUrl || null,
                pitch_deck_url: pitchDeckUrl || null,
                tecnologias: technologies,
                latitude: latitude || null,
                longitude: longitude || null,
                cidade: cidade || data.cidade,
                estado: estado || data.estado,
                cnpj: data.cnpj || null,
                programas_investimentos: data.programas_investimentos || null,
            }

            const payload = {
                owner_type: ownerType,
                owner_id: ownerType === 'existing' ? selectedOwnerId : undefined,
                invite_email: ownerType === 'invite' ? inviteEmail : undefined,
                invite_name: ownerType === 'invite' ? inviteName : undefined,
                startup: startupData,
            }

            const res = await fetch('/api/admin/startups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Erro ao cadastrar startup')
            }

            toast.success(
                ownerType === 'invite'
                    ? 'Startup cadastrada e convite enviado com sucesso!'
                    : 'Startup cadastrada com sucesso!'
            )
            router.push('/admin')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Erro ao cadastrar startup')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Vinculação do Dono (Owner) */}
            <div className="bg-card border p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-amber-500" />
                    Proprietário / Dono da Startup
                </h3>
                <p className="text-sm text-muted-foreground">
                    Escolha se deseja vincular a startup a um usuário já cadastrado ou convidar um novo proprietário por e-mail.
                </p>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant={ownerType === 'existing' ? 'default' : 'outline'}
                        className="flex-1 gap-2"
                        onClick={() => setOwnerType('existing')}
                    >
                        <Users className="w-4 h-4" />
                        Usuário Existente
                    </Button>
                    <Button
                        type="button"
                        variant={ownerType === 'invite' ? 'default' : 'outline'}
                        className="flex-1 gap-2"
                        onClick={() => setOwnerType('invite')}
                    >
                        <UserPlus className="w-4 h-4" />
                        Convidar Novo Usuário
                    </Button>
                </div>

                {ownerType === 'existing' ? (
                    <div className="space-y-3 pt-2">
                        <Label htmlFor="search-user">Buscar Usuário Existente (Sem Startup)</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-user"
                                placeholder="Digite o nome ou e-mail..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {profilesLoading ? (
                            <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" /> Carregando usuários...
                            </div>
                        ) : (
                            <div className="border rounded-lg max-h-[180px] overflow-y-auto bg-muted/20">
                                {filteredProfiles.length === 0 ? (
                                    <div className="p-3 text-center text-sm text-muted-foreground">
                                        Nenhum usuário sem startup encontrado.
                                    </div>
                                ) : (
                                    filteredProfiles.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => setSelectedOwnerId(p.id)}
                                            className={`p-3 border-b last:border-0 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors ${
                                                selectedOwnerId === p.id ? 'bg-amber-500/10 border-amber-500/30' : ''
                                            }`}
                                        >
                                            <div className="text-sm">
                                                <p className="font-medium text-foreground">
                                                    {p.full_name || 'Sem Nome'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{p.email}</p>
                                            </div>
                                            {selectedOwnerId === p.id && (
                                                <span className="text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                                                    Selecionado
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 pt-2 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-name">Nome Completo do Usuário *</Label>
                                <Input
                                    id="invite-name"
                                    placeholder="Ex: João Silva"
                                    value={inviteName}
                                    onChange={(e) => setInviteName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-email">E-mail para Convite *</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="Ex: joao@empresa.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-amber-500">
                            * Um convite oficial será enviado para este e-mail. Quando o usuário aceitar, ele poderá redefinir sua senha e terá acesso direto à startup cadastrada aqui.
                        </p>
                    </div>
                )}
            </div>

            {/* Informações da Startup */}
            <div className="bg-card border p-6 rounded-xl space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Dados da Startup</h3>

                {/* Banner Upload */}
                <div className="space-y-2">
                    <Label>Banner da Startup (Opcional)</Label>
                    <div className="space-y-3">
                        {bannerUrl && (
                            <div className="relative h-32 w-full rounded-lg overflow-hidden bg-stone-100 border">
                                <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
                            </div>
                        )}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                className="hidden"
                                id="banner-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('banner-upload')?.click()}
                                disabled={uploadingBanner}
                            >
                                {uploadingBanner ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4 mr-2" />
                                )}
                                {bannerUrl ? 'Alterar Banner' : 'Enviar Banner'}
                            </Button>
                        </div>
                    </div>
                </div>

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
                    <Input id="name" {...register('name', { required: 'Nome é obrigatório' })} />
                    {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
                </div>

                {/* CNPJ */}
                <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                    <Controller
                        name="cnpj"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="cnpj"
                                placeholder="00.000.000/0000-00"
                                maxLength={18}
                                value={field.value || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    let formatted = value
                                    if (value.length > 0) {
                                        formatted = value.replace(/^(\d{2})(\d)/, '$1.$2')
                                        formatted = formatted.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                                        formatted = formatted.replace(/\.(\d{3})(\d)/, '.$1/$2')
                                        formatted = formatted.replace(/(\d{4})(\d)/, '$1-$2')
                                    }
                                    field.onChange(formatted)
                                }}
                            />
                        )}
                    />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea id="description" {...register('description', { required: 'Descrição é obrigatória' })} rows={4} />
                    {errors.description && <p className="text-sm text-destructive">{String(errors.description.message)}</p>}
                </div>

                {/* Segmento */}
                <div className="space-y-2">
                    <Label htmlFor="segmento">Segmento *</Label>
                    <Controller
                        name="segmento"
                        control={control}
                        rules={{ required: 'Segmento é obrigatório' }}
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
                    {errors.segmento && <p className="text-sm text-destructive">{String(errors.segmento.message)}</p>}
                </div>

                {/* Estágio de Maturidade */}
                <div className="space-y-2">
                    <Label htmlFor="estagio_maturidade">Estágio de Maturidade *</Label>
                    <Controller
                        name="estagio_maturidade"
                        control={control}
                        rules={{ required: 'Estágio de maturidade é obrigatório' }}
                        render={({ field }) => (
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um estágio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ESTAGIOS.map((est) => (
                                        <SelectItem key={est.value} value={est.value}>
                                            {est.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.estagio_maturidade && <p className="text-sm text-destructive">{String(errors.estagio_maturidade.message)}</p>}
                </div>

                {/* Programas e Investimentos */}
                <div className="space-y-2">
                    <Label htmlFor="programas_investimentos">Programas de Aceleração, Prêmios e Investimentos Recebidos</Label>
                    <Textarea
                        id="programas_investimentos"
                        {...register('programas_investimentos')}
                        placeholder="Ex: Acelerada pelo Inovativa Brasil 2024, recebeu investimento anjo de R$ 150k..."
                        rows={3}
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

                {/* Pitch Deck */}
                <div className="space-y-2">
                    <Label>Pitch Deck (PDF)</Label>
                    <div className="flex items-center gap-4">
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
                        name="tem_esg"
                        control={control}
                        render={({ field }) => (
                            <Checkbox id="tem_esg" checked={!!field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <Label htmlFor="tem_esg" className="cursor-pointer">
                        Startup com foco em ESG (Ambiental, Social e Governança)
                    </Label>
                </div>

                {/* Ano de Fundação */}
                <div className="space-y-2">
                    <Label htmlFor="ano_fundacao">Ano de Fundação *</Label>
                    <Input
                        id="ano_fundacao"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        {...register('ano_fundacao', { required: 'Ano de fundação é obrigatório', valueAsNumber: true })}
                    />
                    {errors.ano_fundacao && <p className="text-sm text-destructive">{String(errors.ano_fundacao.message)}</p>}
                </div>

                {/* Website */}
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" placeholder="https://..." {...register('website')} />
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" type="url" placeholder="https://linkedin.com/..." {...register('linkedin')} />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" type="url" placeholder="https://instagram.com/..." {...register('instagram')} />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                            id="cidade"
                            {...register('cidade', { required: 'Cidade é obrigatória' })}
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                        />
                        {errors.cidade && <p className="text-sm text-destructive">{String(errors.cidade.message)}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado (UF) *</Label>
                        <Input
                            id="estado"
                            {...register('estado', { required: 'Estado é obrigatório' })}
                            value={estado}
                            onChange={(e) => setEstado(e.target.value.toUpperCase())}
                            maxLength={2}
                            placeholder="CE"
                        />
                        {errors.estado && <p className="text-sm text-destructive">{String(errors.estado.message)}</p>}
                    </div>
                </div>

                {/* Localização */}
                <LocationPicker
                    initialLat={latitude}
                    initialLng={longitude}
                    cidade={cidade}
                    estado={estado}
                    onLocationSelect={(lat, lng) => {
                        setLatitude(lat)
                        setLongitude(lng)
                    }}
                />
            </div>

            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin')}
                    disabled={loading}
                    className="flex-1"
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Criar e Cadastrar Startup
                </Button>
            </div>
        </form>
    )
}
