'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { 
    Users, Plus, Trash2, Edit2, CheckCircle2, Circle, 
    Linkedin, Instagram, Sparkles, Target, AlertCircle, Loader2 
} from 'lucide-react'
import { toast } from 'sonner'
import { CommunityLeader } from '@/types/database'

interface ProfileOption {
    id: string
    full_name: string | null
    email: string
}

const CHECKLIST_ITEMS = [
    { id: 'linkedin_headline', label: "LinkedIn: Mencionar 'Community Leader @ Monólitos Valley' no título", category: 'Linkedin' },
    { id: 'linkedin_experience', label: "LinkedIn: Adicionar experiência voluntária de Community Leader", category: 'Linkedin' },
    { id: 'linkedin_startup', label: "LinkedIn: Adicionar sua respectiva startup no perfil do LinkedIn", category: 'Linkedin' },
    { id: 'linkedin_post', label: "Post: Publicar post/depoimento no LinkedIn sobre o ecossistema", category: 'Linkedin' },
    { id: 'instagram_collab', label: "Redes: Collab no Instagram/TikTok com a comunidade", category: 'Redes' },
    { id: 'client_interviews', label: "Mercado: Entrevistar 5 clientes reais (sair do PowerPoint/Hackathon)", category: 'Mercado' },
    { id: 'monthly_retro', label: "Feedback: Enviar retro mensal com impedimentos da startup", category: 'Engajamento' },
    { id: 'event_presence', label: "Ecosistema: Comparecer a 1 evento externo (fora da universidade)", category: 'Engajamento' },
]

export function AdminLeaders() {
    const [leaders, setLeaders] = useState<CommunityLeader[]>([])
    const [profiles, setProfiles] = useState<ProfileOption[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedLeader, setSelectedLeader] = useState<CommunityLeader | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        role_title: 'Community Leader',
        startup_name: '',
        linkedin_url: '',
        instagram_url: '',
        profile_id: ''
    })

    useEffect(() => {
        fetchLeaders()
        fetchProfiles()
    }, [])

    async function fetchLeaders() {
        try {
            const res = await fetch('/api/admin/leaders')
            const data = await res.json()
            if (res.ok) {
                setLeaders(data.data || [])
            } else {
                toast.error(data.error || "Erro ao buscar lideranças")
            }
        } catch (err) {
            console.error(err)
            toast.error("Erro na comunicação com a API")
        } finally {
            setLoading(false)
        }
    }

    async function fetchProfiles() {
        try {
            const res = await fetch('/api/admin/profiles')
            const data = await res.json()
            if (res.ok) {
                setProfiles(data.data || [])
            }
        } catch (err) {
            console.error(err)
        }
    }

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            role_title: 'Community Leader',
            startup_name: '',
            linkedin_url: '',
            instagram_url: '',
            profile_id: ''
        })
    }

    const handleCreateLeader = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.full_name || !formData.role_title) {
            toast.error("Preencha nome completo e cargo")
            return
        }
        setSubmitting(true)
        try {
            const res = await fetch('/api/admin/leaders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                toast.success("Liderança adicionada com sucesso!")
                setLeaders([...leaders, data.data].sort((a, b) => a.full_name.localeCompare(b.full_name)))
                setIsCreateOpen(false)
                resetForm()
            } else {
                toast.error(data.error || "Erro ao criar liderança")
            }
        } catch (err) {
            console.error(err)
            toast.error("Erro interno")
        } finally {
            setSubmitting(false)
        }
    }

    const handleToggleTask = async (leader: CommunityLeader, taskId: string) => {
        const isCompleted = leader.checklist?.includes(taskId) || false
        const updatedChecklist = isCompleted
            ? (leader.checklist || []).filter(id => id !== taskId)
            : [...(leader.checklist || []), taskId]

        try {
            const res = await fetch(`/api/admin/leaders/${leader.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checklist: updatedChecklist })
            })
            const data = await res.json()
            if (res.ok) {
                setLeaders(leaders.map(l => l.id === leader.id ? data.data : l))
                if (selectedLeader?.id === leader.id) {
                    setSelectedLeader(data.data)
                }
            } else {
                toast.error("Erro ao salvar progresso")
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteLeader = async (leaderId: string) => {
        if (!confirm("Tem certeza que deseja remover esta liderança?")) return
        try {
            const res = await fetch(`/api/admin/leaders/${leaderId}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success("Liderança removida")
                setLeaders(leaders.filter(l => l.id !== leaderId))
                setIsDetailsOpen(false)
            } else {
                toast.error("Erro ao deletar")
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
                <p className="text-muted-foreground text-sm">Carregando lista de lideranças...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Lideranças da Comunidade</h2>
                    <p className="text-muted-foreground text-sm">
                        Acompanhe o engajamento prático, desenvolvimento de mercado e visibilidade dos líderes voluntários.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#F2CB05] hover:bg-[#d4b304] text-stone-900 font-semibold gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Adicionar Líder</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Nova Liderança</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateLeader} className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">Nome Completo *</Label>
                                <Input 
                                    id="full_name" 
                                    value={formData.full_name} 
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                                    placeholder="Ex: João Silva"
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail (Opcional)</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={formData.email} 
                                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                    placeholder="Ex: joao@gmail.com" 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role_title">Cargo / Função *</Label>
                                <Input 
                                    id="role_title" 
                                    value={formData.role_title} 
                                    onChange={e => setFormData({ ...formData, role_title: e.target.value })} 
                                    placeholder="Ex: Community Leader, Head de Mentoria" 
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="startup_name">Startup Relacionada (Opcional)</Label>
                                <Input 
                                    id="startup_name" 
                                    value={formData.startup_name} 
                                    onChange={e => setFormData({ ...formData, startup_name: e.target.value })} 
                                    placeholder="Ex: ApexVet" 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="profile_id">Vincular a Usuário da Plataforma (Opcional)</Label>
                                <select 
                                    id="profile_id" 
                                    value={formData.profile_id}
                                    onChange={e => setFormData({ ...formData, profile_id: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Não vincular / Criar perfil isolado</option>
                                    {profiles.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.full_name || p.email} ({p.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="linkedin_url">LinkedIn URL (Opcional)</Label>
                                <Input 
                                    id="linkedin_url" 
                                    value={formData.linkedin_url} 
                                    onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} 
                                    placeholder="Ex: https://linkedin.com/in/perfil" 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">Instagram URL (Opcional)</Label>
                                <Input 
                                    id="instagram_url" 
                                    value={formData.instagram_url} 
                                    onChange={e => setFormData({ ...formData, instagram_url: e.target.value })} 
                                    placeholder="Ex: https://instagram.com/perfil" 
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Adicionando..." : "Confirmar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {leaders.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                        <p className="text-muted-foreground">Nenhuma liderança cadastrada ainda.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leaders.map(leader => {
                        const completedCount = leader.checklist?.length || 0
                        const totalCount = CHECKLIST_ITEMS.length
                        const pct = Math.round((completedCount / totalCount) * 100)

                        return (
                            <Card key={leader.id} className="hover:shadow-md transition-shadow relative overflow-hidden group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg font-bold">{leader.full_name}</CardTitle>
                                            <CardDescription className="text-xs">{leader.role_title}</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {leader.linkedin_url && (
                                                <a href={leader.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-blue-600 transition-colors">
                                                    <Linkedin className="h-4 w-4" />
                                                </a>
                                            )}
                                            {leader.instagram_url && (
                                                <a href={leader.instagram_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-pink-600 transition-colors">
                                                    <Instagram className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {leader.startup_name && (
                                        <Badge variant="outline" className="w-fit text-[10px] mt-1 bg-amber-50/50">
                                            Startup: {leader.startup_name}
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Progresso do Checklist */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-medium text-stone-600">
                                            <span>Checklist Prático</span>
                                            <span>{completedCount}/{totalCount} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/40">
                                            <div className="bg-[#F2CB05] h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Action button para gerenciar checklist */}
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        className="w-full text-xs font-semibold gap-1"
                                        onClick={() => {
                                            setSelectedLeader(leader)
                                            setIsDetailsOpen(true)
                                        }}
                                    >
                                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Ver Checklist & Detalhes</span>
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Modal de Detalhes & Checklist do Líder */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                    {selectedLeader && (
                        <>
                            <DialogHeader>
                                <div className="flex justify-between items-start pr-6">
                                    <div>
                                        <DialogTitle className="text-xl font-bold">{selectedLeader.full_name}</DialogTitle>
                                        <p className="text-xs text-muted-foreground">{selectedLeader.role_title}</p>
                                    </div>
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="h-8 w-8 opacity-70 hover:opacity-100"
                                        onClick={() => handleDeleteLeader(selectedLeader.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="space-y-5 py-4">
                                {/* Informações Básicas */}
                                <div className="bg-stone-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs border border-stone-200/60">
                                    <div>
                                        <p className="font-semibold text-stone-500">Startup</p>
                                        <p className="font-medium text-stone-900">{selectedLeader.startup_name || 'Nenhuma vinculada'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-stone-500">E-mail</p>
                                        <p className="font-medium text-stone-900 truncate">{selectedLeader.email || 'Não informado'}</p>
                                    </div>
                                </div>

                                {/* Checklist Interativo */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Target className="h-4 w-4 text-[#F2CB05]" />
                                        <h4 className="text-sm font-bold text-stone-900">Checklist: Do Acadêmico ao Mercado</h4>
                                    </div>
                                    <div className="divide-y border rounded-lg bg-background overflow-hidden">
                                        {CHECKLIST_ITEMS.map(item => {
                                            const done = selectedLeader.checklist?.includes(item.id) || false
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleToggleTask(selectedLeader, item.id)}
                                                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-stone-50/50 transition-colors"
                                                >
                                                    <span className={`text-xs ${done ? 'line-through text-stone-400 font-normal' : 'text-stone-700 font-medium'}`}>
                                                        {item.label}
                                                    </span>
                                                    <div>
                                                        {done ? (
                                                            <CheckCircle2 className="h-4.5 w-4.5 text-green-500 fill-green-50" />
                                                        ) : (
                                                            <Circle className="h-4.5 w-4.5 text-stone-300" />
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Mentalidade Warning */}
                                <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-3 flex gap-2">
                                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-xs text-amber-900 leading-relaxed">
                                        <span className="font-bold">Dica de Acompanhamento:</span> A maioria dos jovens líderes ainda foca muito em prêmios de hackathons ou PowerPoints acadêmicos. Incentive-os a preencher os itens de Mercado e Redes para expor seu perfil de fundador e conectar a startup ao mundo real.
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
