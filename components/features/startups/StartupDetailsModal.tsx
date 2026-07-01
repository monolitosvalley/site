'use client'

import { useEffect, useState } from 'react'
import { Startup, TeamMember } from '@/types/database'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Globe, FileText, Leaf, TrendingUp, Share2, Camera, Users, Linkedin, Github, Briefcase, BookOpen, Instagram, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCNPJ } from '@/lib/utils'

interface StartupDetailsModalProps {
    startup: Startup | null
    open: boolean
    onOpenChange: (open: boolean) => void
    showTeamMembers?: boolean
    showFullPageButton?: boolean
}

const ESTAGIO_LABELS: Record<string, string> = {
    ideia: 'Ideação',
    validacao: 'Validação',
    mvp: 'MVP',
    tracao: 'Tração',
    escala: 'Escala',
    crescimento: 'Crescimento',
}

export function StartupDetailsModal({
    startup,
    open,
    onOpenChange,
    showTeamMembers = true,
    showFullPageButton = false
}: StartupDetailsModalProps) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [loadingMembers, setLoadingMembers] = useState(false)

    useEffect(() => {
        if (startup && open && showTeamMembers) {
            fetchTeamMembers()
        }
    }, [startup, open, showTeamMembers])

    const fetchTeamMembers = async () => {
        if (!startup) return

        setLoadingMembers(true)
        try {
            const res = await fetch(`/api/team-members?startupId=${startup.id}`)
            if (res.ok) {
                const { data } = await res.json()
                setTeamMembers(data || [])
            }
        } catch (error) {
            console.error('Error fetching team members:', error)
        } finally {
            setLoadingMembers(false)
        }
    }

    const handleOpenFullPage = () => {
        if (startup?.slug) {
            window.open(`/startups/${startup.slug}`, '_blank')
        }
    }

    if (!startup) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                {/* Banner Image */}
                {startup.banner_url ? (
                    <div className="relative h-32 w-full bg-stone-100">
                        <Image
                            src={startup.banner_url}
                            alt={`${startup.name} banner`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-16 w-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-b" />
                )}

                <div className="p-6">
                    <DialogHeader>
                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 -mt-12 sm:-mt-16">
                            {/* Logo on the left */}
                            {startup.logo_url ? (
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={startup.logo_url}
                                        alt={startup.name}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-4 border-white bg-gradient-to-br from-amber-400 to-orange-500 shadow-md flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                    {startup.name.charAt(0)}
                                </div>
                            )}

                            {/* Title and info on the right */}
                            <div className="flex-1 min-w-0 sm:pt-8">
                                <DialogTitle className="text-2xl mb-1">{startup.name}</DialogTitle>
                                {startup.cnpj && (
                                    <p className="text-xs text-muted-foreground mb-2">CNPJ: {formatCNPJ(startup.cnpj)}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-amber-100 text-amber-800 border border-amber-300">
                                        {startup.segmento}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {ESTAGIO_LABELS[startup.estagio_maturidade] || startup.estagio_maturidade}
                                    </Badge>
                                    {startup.tem_esg && (
                                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                                            <Leaf className="w-3 h-3 mr-1" />
                                            ESG
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Descrição */}
                    {startup.description && (
                        <div className="border-l-4 border-amber-500 pl-4">
                            <h3 className="font-semibold mb-2">Sobre</h3>
                            <p className="text-sm text-muted-foreground">{startup.description}</p>
                        </div>
                    )}

                    {/* Programas e Investimentos */}
                    {startup.programas_investimentos && (
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold mb-2">Programas e Investimentos</h3>
                            <p className="text-sm text-muted-foreground">{startup.programas_investimentos}</p>
                        </div>
                    )}

                    {/* Localização e Fundação */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2 text-blue-900 mb-1">
                                <MapPin className="h-4 w-4" />
                                Localização
                            </h3>
                            <p className="text-sm text-blue-800">
                                {startup.cidade}, {startup.estado}
                            </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2 text-purple-900 mb-1">
                                <Calendar className="h-4 w-4" />
                                Fundação
                            </h3>
                            <p className="text-sm text-purple-800">{startup.ano_fundacao}</p>
                        </div>
                    </div>

                    {/* Tecnologias */}
                    {startup.tecnologias && startup.tecnologias.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-sm mb-2">Tecnologias</h3>
                            <div className="flex flex-wrap gap-2">
                                {startup.tecnologias.map((tech) => (
                                    <Badge key={tech} variant="outline" className="text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ESG */}
                    {startup.tem_esg && startup.detalhes_esg && (
                        <div>
                            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-green-600" />
                                Práticas ESG
                            </h3>
                            <p className="text-sm text-muted-foreground">{startup.detalhes_esg}</p>
                        </div>
                    )}

                    {/* Links */}
                    {(startup.website || startup.linkedin || startup.instagram || startup.pitch_deck_url) && (
                        <div>
                            <h3 className="font-semibold text-sm mb-3">Links</h3>
                            <div className="flex flex-wrap gap-2">
                                {startup.website && (
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full" asChild>
                                        <Link href={startup.website} target="_blank" rel="noopener noreferrer">
                                            <Globe className="h-4 w-4 mr-2" />
                                            Website
                                        </Link>
                                    </Button>
                                )}
                                {startup.linkedin && (
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full" asChild>
                                        <Link href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            LinkedIn
                                        </Link>
                                    </Button>
                                )}
                                {startup.instagram && (
                                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white rounded-full" asChild>
                                        <Link href={startup.instagram} target="_blank" rel="noopener noreferrer">
                                            <Camera className="h-4 w-4 mr-2" />
                                            Instagram
                                        </Link>
                                    </Button>
                                )}
                                {startup.pitch_deck_url && (
                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full" asChild>
                                        <Link href={`/api/pitch-deck/${startup.owner_id}`} target="_blank" rel="noopener noreferrer">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Pitch Deck
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Full Page Button */}
                    {showFullPageButton && startup?.slug && (
                        <div className="pt-4 border-t border-stone-200">
                            <Button
                                onClick={handleOpenFullPage}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                size="lg"
                            >
                                <ExternalLink className="h-5 w-5 mr-2" />
                                Explorar Startup Completa
                            </Button>
                        </div>
                    )}

                    {/* Team Members */}
                    {showTeamMembers && teamMembers.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Time
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            {member.photo_url ? (
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={member.photo_url}
                                                        alt={member.full_name}
                                                        width={32}
                                                        height={32}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {member.full_name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-stone-900 truncate">
                                                    {member.full_name}
                                                </p>
                                                <p className="text-xs text-amber-600">{member.role}</p>
                                            </div>
                                        </div>
                                        {/* Social Icons */}
                                        <div className="flex gap-1 mt-2">
                                            {member.linkedin && (
                                                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <Linkedin className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            {member.github && (
                                                <Link href={member.github} target="_blank" rel="noopener noreferrer" className="text-stone-800 hover:text-stone-900">
                                                    <Github className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            {member.behance && (
                                                <Link href={member.behance} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            {member.portfolio && (
                                                <Link href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">
                                                    <Globe className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            {member.lattes && (
                                                <Link href={member.lattes} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            {member.instagram && (
                                                <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                                    <Instagram className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
