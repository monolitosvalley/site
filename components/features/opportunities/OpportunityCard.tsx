import { Opportunity } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Crown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'

interface OpportunityCardProps {
    opportunity: Opportunity
}

const TYPE_LABELS: Record<string, string> = {
    Investidor: 'Investidor',
    Edital: 'Edital',
    InovacaoAberta: 'Inovação Aberta',
    Beneficio: 'Benefício',
    Talento: 'Talento',
    Vaga: 'Vaga',
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
    const deadline = opportunity.deadline ? new Date(opportunity.deadline) : null
    const formattedDeadline = deadline
        ? format(deadline, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
        : null

    return (
        <Card className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
            {opportunity.image_url && (
                <div className="relative w-full h-48 bg-muted">
                    <Image
                        src={opportunity.image_url}
                        alt={opportunity.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex-1 text-lg">{opportunity.title}</CardTitle>
                    <div className="flex gap-2 flex-shrink-0">
                        <Badge>{TYPE_LABELS[opportunity.type] || opportunity.type}</Badge>
                        {opportunity.is_paid_feature && (
                            <Badge variant="secondary" className="gap-1">
                                <Crown className="w-3 h-3" />
                                Premium
                            </Badge>
                        )}
                    </div>
                </div>
                {formattedDeadline && (
                    <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Prazo: {formattedDeadline}
                    </CardDescription>
                )}
            </CardHeader>
            {opportunity.description && (
                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {opportunity.description}
                    </p>
                </CardContent>
            )}
            {opportunity.application_url && (
                <CardContent className="pt-0">
                    <Button asChild className="w-full" size="sm">
                        <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Inscrever-se
                        </a>
                    </Button>
                </CardContent>
            )}
        </Card>
    )
}
