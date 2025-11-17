import { Opportunity } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Crown } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex-1">{opportunity.title}</CardTitle>
                    <div className="flex gap-2">
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
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {opportunity.description}
                    </p>
                </CardContent>
            )}
        </Card>
    )
}
