'use client'

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
import { X } from 'lucide-react'

export interface StartupFilters {
    segmento?: string
    estagio_maturidade?: string
    is_esg?: boolean
}

interface StartupFiltersProps {
    filters: StartupFilters
    onFilterChange: (filters: StartupFilters) => void
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

export function StartupFilters({ filters, onFilterChange }: StartupFiltersProps) {
    const handleReset = () => {
        onFilterChange({})
    }

    const hasActiveFilters = filters.segmento || filters.estagio_maturidade || filters.is_esg

    return (
        <div className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filtros</h3>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                        <X className="w-4 h-4 mr-1" />
                        Limpar
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Segmento</Label>
                    <Select
                        value={filters.segmento || 'all'}
                        onValueChange={(value) =>
                            onFilterChange({ ...filters, segmento: value === 'all' ? undefined : value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todos os segmentos" />
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

                <div className="space-y-2">
                    <Label>Estágio de Maturidade</Label>
                    <Select
                        value={filters.estagio_maturidade || 'all'}
                        onValueChange={(value) =>
                            onFilterChange({
                                ...filters,
                                estagio_maturidade: value === 'all' ? undefined : value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todos os estágios" />
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

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="esg"
                        checked={filters.is_esg || false}
                        onCheckedChange={(checked) =>
                            onFilterChange({ ...filters, is_esg: checked as boolean })
                        }
                    />
                    <Label htmlFor="esg" className="cursor-pointer">
                        Apenas startups ESG
                    </Label>
                </div>
            </div>
        </div>
    )
}
