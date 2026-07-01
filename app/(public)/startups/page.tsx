'use client'

import { useState, useEffect } from 'react'
import { Startup } from '@/types/database'
import { StartupGrid } from '@/components/features/startups/StartupGrid'
import { StartupFilters, StartupFilters as Filters } from '@/components/features/startups/StartupFilters'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Grid3x3, Map } from 'lucide-react'
import dynamic from 'next/dynamic'

const StartupMap = dynamic(
    () => import('@/components/features/startups/StartupMap').then((mod) => ({ default: mod.StartupMap })),
    { ssr: false, loading: () => <div className="h-[600px] bg-muted animate-pulse rounded-lg" /> }
)

export default function StartupsPage() {
    const [startups, setStartups] = useState<Startup[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<Filters>({})
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Startups</h1>
                <p className="text-muted-foreground">
                    Conheça as startups que estão transformando o Sertão Central Cearense
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <StartupFilters filters={filters} onFilterChange={handleFilterChange} />
                </aside>

                <main className="lg:col-span-3">
                    <Tabs defaultValue="grid" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="grid" className="flex items-center gap-2">
                                <Grid3x3 className="h-4 w-4" />
                                Grade
                            </TabsTrigger>
                            <TabsTrigger value="map" className="flex items-center gap-2">
                                <Map className="h-4 w-4" />
                                Mapa
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="grid">
                            <StartupGrid startups={startups} loading={loading} />
                        </TabsContent>

                        <TabsContent value="map">
                            <StartupMap startups={startups} />
                        </TabsContent>
                    </Tabs>

                    {/* Pagination */}
                    {totalPages > 1 && !loading && (
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
