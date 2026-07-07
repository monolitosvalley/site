'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { X, Loader2, Search } from 'lucide-react'

export interface StartupFilters {
    segmento?: string
    estagio_maturidade?: string
    is_esg?: boolean
    cidade?: string
    search?: string
}

interface StartupFiltersProps {
    filters: StartupFilters
    onFilterChange: (filters: StartupFilters) => void
    viewMode: 'grid' | 'map'
    onViewModeChange: (mode: 'grid' | 'map') => void
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

const ESTAGIOS = ['Ideação', 'Validação', 'Operação', 'Tração', 'Scale-up']

export function StartupFilters({ filters, onFilterChange, viewMode, onViewModeChange }: StartupFiltersProps) {
    const [cities, setCities] = useState<string[]>([])
    const [loadingCities, setLoadingCities] = useState(true)
    const [searchInput, setSearchInput] = useState(filters.search || '')

    useEffect(() => {
        async function fetchCities() {
            try {
                const res = await fetch('/api/startups/cities')
                if (res.ok) {
                    const data = await res.json()
                    setCities(data.data || [])
                }
            } catch (e) {
                console.error("Error fetching cities:", e)
            } finally {
                setLoadingCities(false)
            }
        }
        fetchCities()
    }, [])

    // Debounce or handle search input submit
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (filters.search !== searchInput) {
                onFilterChange({ ...filters, search: searchInput || undefined })
            }
        }, 400)

        return () => clearTimeout(delayDebounceFn)
    }, [searchInput])

    const handleReset = () => {
        setSearchInput('')
        onFilterChange({})
    }

    const hasActiveFilters = filters.segmento || filters.estagio_maturidade || filters.is_esg || filters.cidade || filters.search

    return (
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            {/* 1. Full-width search bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                    type="text"
                    placeholder="Buscar por nome ou descrição da startup..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9 h-11 bg-stone-50/50 border-stone-200/80 rounded-lg focus-visible:ring-amber-500"
                />
            </div>

            {/* 2. Filters & Toggle Grid/Map */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
                {/* Horizontal filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-[180px]">
                        <Select
                            value={filters.segmento || 'all'}
                            onValueChange={(value) =>
                                onFilterChange({ ...filters, segmento: value === 'all' ? undefined : value })
                            }
                        >
                            <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="Segmento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os segmentos</SelectItem>
                                {SEGMENTOS.map((segmento) => (
                                    <SelectItem key={segmento} value={segmento}>
                                        {segmento}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[180px]">
                        <Select
                            value={filters.estagio_maturidade || 'all'}
                            onValueChange={(value) =>
                                onFilterChange({
                                    ...filters,
                                    estagio_maturidade: value === 'all' ? undefined : value,
                                })
                            }
                        >
                            <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="Estágio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os estágios</SelectItem>
                                {ESTAGIOS.map((estagio) => (
                                    <SelectItem key={estagio} value={estagio}>
                                        {estagio}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[180px]">
                        {loadingCities ? (
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 border rounded-md h-9 px-3">
                                <Loader2 className="w-3 h-3 animate-spin" /> Carregando...
                            </div>
                        ) : (
                            <Select
                                value={filters.cidade || 'all'}
                                onValueChange={(value) =>
                                    onFilterChange({
                                        ...filters,
                                        cidade: value === 'all' ? undefined : value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Cidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as cidades</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 border rounded-md px-3 h-9 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                        <Checkbox
                            id="esg"
                            checked={filters.is_esg || false}
                            onCheckedChange={(checked) =>
                                onFilterChange({ ...filters, is_esg: checked as boolean })
                            }
                            className="h-4 w-4 rounded border-stone-300 text-amber-500 focus:ring-amber-500"
                        />
                        <Label htmlFor="esg" className="text-xs font-medium cursor-pointer text-stone-600">
                            Apenas ESG
                        </Label>
                    </div>

                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-9 px-2 hover:text-stone-900 text-stone-500">
                            <X className="w-3.5 h-3.5 mr-1" />
                            Limpar
                        </Button>
                    )}
                </div>

                {/* Right side: View mode toggle */}
                <div className="flex items-center border rounded-lg p-0.5 bg-stone-100 self-end md:self-auto">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            viewMode === 'grid'
                                ? 'bg-white text-stone-900 shadow-sm'
                                : 'text-stone-500 hover:text-stone-900'
                        }`}
                    >
                        Grade
                    </button>
                    <button
                        onClick={() => onViewModeChange('map')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            viewMode === 'map'
                                ? 'bg-white text-stone-900 shadow-sm'
                                : 'text-stone-500 hover:text-stone-900'
                        }`}
                    >
                        Mapa
                    </button>
                </div>
            </div>
        </div>
    )
}
