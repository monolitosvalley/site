'use client'

import { useState, useEffect } from 'react'
import { Startup } from '@/types/database'
import { StartupGrid } from '@/components/features/startups/StartupGrid'
import { StartupFilters, StartupFilters as Filters } from '@/components/features/startups/StartupFilters'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const StartupMap = dynamic(
    () => import('@/components/features/startups/StartupMap').then((mod) => ({ default: mod.StartupMap })),
    { ssr: false, loading: () => <div className="h-[600px] bg-muted animate-pulse rounded-lg" /> }
)

export default function StartupsPage() {
    const [startups, setStartups] = useState<Startup[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<Filters>({})
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        async function fetchStartups() {
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: '9',
                })

                if (filters.segmento) params.append('segmento', filters.segmento)
                if (filters.estagio_maturidade) params.append('estagio_maturidade', filters.estagio_maturidade)
                if (filters.is_esg) params.append('is_esg', 'true')
                if (filters.cidade) params.append('cidade', filters.cidade)
                if (filters.search) params.append('search', filters.search)

                const res = await fetch(`/api/startups?${params}`)
                if (res.ok) {
                    const data = await res.json()
                    setStartups(data.data || [])
                    setTotalPages(data.totalPages || 1)
                }
            } catch (error) {
                console.error('Error fetching startups:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStartups()
    }, [filters, page])

    const handleFilterChange = (newFilters: Filters) => {
        setFilters(newFilters)
        setPage(1) // Reset to first page when filters change
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2">Startups</h1>
                <p className="text-muted-foreground">
                    Conheça as startups que estão transformando o Sertão Central Cearense
                </p>
            </div>

            <div className="space-y-6">
                {/* Horizontal Top Filters */}
                <StartupFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                {/* Main Content Area */}
                <main className="w-full">
                    {viewMode === 'grid' ? (
                        <StartupGrid startups={startups} loading={loading} />
                    ) : (
                        <StartupMap startups={startups} />
                    )}

                    {/* Pagination */}
                    {viewMode === 'grid' && totalPages > 1 && !loading && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Anterior
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Página {page} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Próxima
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
