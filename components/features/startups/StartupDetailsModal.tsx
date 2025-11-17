'use client'

import { Startup } from '@/types/database'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, MapPin, Calendar, Globe, Linkedin, Instagram, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface StartupDetailsModalProps {
    startup: Startup | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ESTAGIO_LABELS: Record<string, string> = {
    ideia: 'Ideação',
    validacao: 'Validação',
    mvp: 'MVP',
    tracao: 'Tração',
    escala: 'Escala',
    crescimento: 'Crescimento',
}

export function StartupDetailsModal({ startup, open, onOpenChange }: StartupDetailsModalProps) {
    if (!startup) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {startup.logo_url && (
                            <Image
                                src={startup.logo_url}
                                alt={startup.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <DialogTitle className="text-2xl">{startup.name}</DialogTitle>
                            <DialogDescription className="mt-2">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">{startup.segmento}</Badge>
                                    <Badge variant="outline">
                                        {ESTAGIO_LABELS[startup.estagio_maturidade] || startup.estagio_maturidade}
                                    </Badge>
                                    {startup.tem_esg && <Badge className="bg-green-600">ESG</Badge>}
                                </div>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Descrição */}
                    <div>
                        <h3 className="font-semibold mb-2">Sobre</h3>
                        <p className="text-sm text-muted-foreground">{startup.description}</p>
                    </div>

                    {/* Localização */}
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Localização
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {startup.cidade}, {startup.estado}
                        </p>
                    </div>

                    {/* Ano de Fundação */}
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fundação
                        </h3>
                        <p className="text-sm text-muted-foreground">{startup.ano_fundacao}</p>
                    </div>

                    {/* Tecnologias */}
                    {startup.tecnologias && startup.tecnologias.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Tecnologias</h3>
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
                            <h3 className="font-semibold mb-2">Práticas ESG</h3>
                            <p className="text-sm text-muted-foreground">{startup.detalhes_esg}</p>
                        </div>
                    )}

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-3">Links</h3>
                        <div className="flex flex-wrap gap-2">
                            {startup.website && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={startup.website} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Website
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </Button>
                            )}
                            {startup.linkedin && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4 mr-2" />
                                        LinkedIn
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </Button>
                            )}
                            {startup.instagram && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={startup.instagram} target="_blank" rel="noopener noreferrer">
                                        <Instagram className="h-4 w-4 mr-2" />
                                        Instagram
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </Button>
                            )}
                            {startup.pitch_deck_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/api/pitch-deck/${startup.owner_id}`} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Pitch Deck
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
