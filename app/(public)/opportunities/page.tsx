'use client'

import { useState, useEffect } from 'react'
import { Opportunity } from '@/types/database'
import { OpportunityTabs } from '@/components/features/opportunities/OpportunityTabs'
import { OpportunityCard } from '@/components/features/opportunities/OpportunityCard'
import { Button } from '@/components/ui/button'
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'

export default function OpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [viewMode, setViewMode] = useState<'tabs' | 'calendar'>('tabs')

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // Check authentication
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                setIsAuthenticated(!!user)

                // Fetch opportunities
                const res = await fetch('/api/opportunities')
                if (res.ok) {
                    const data = await res.json()
                    setOpportunities(data.data || [])
                }
            } catch (error) {
                console.error('Error fetching opportunities:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const opportunitiesWithDeadline = opportunities
        .filter((opp) => opp.deadline)
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())

    const groupByMonth = () => {
        const grouped: { [key: string]: Opportunity[] } = {}

        opportunitiesWithDeadline.forEach((opp) => {
            const date = parseISO(opp.deadline!)
            const monthKey = format(date, 'MMMM yyyy', { locale: ptBR })

            if (!grouped[monthKey]) {
                grouped[monthKey] = []
            }
            grouped[monthKey].push(opp)
        })

        return grouped
    }

    const groupedOpportunities = groupByMonth()

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header com filtros */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Oportunidades</h1>
                    <p className="text-muted-foreground">
                        Explore investimentos, editais, vagas e benefícios da comunidade
                    </p>
                </div>

                {/* Toggle de visualização */}
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'tabs' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('tabs')}
                        className={viewMode === 'tabs' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    >
                        Por Categoria
                    </Button>
                    <Button
                        variant={viewMode === 'calendar' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className={viewMode === 'calendar' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Por Prazo
                    </Button>
                </div>
            </div>

            {/* Conteúdo */}
            {viewMode === 'tabs' ? (
                <OpportunityTabs opportunities={opportunities} isAuthenticated={isAuthenticated} />
            ) : (
                opportunitiesWithDeadline.length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Nenhuma oportunidade com prazo definido no momento
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedOpportunities).map(([month, monthOpps]) => (
                            <div key={month}>
                                <h2 className="text-2xl font-bold mb-4 capitalize">{month}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {monthOpps.map((opportunity) => (
                                        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}
