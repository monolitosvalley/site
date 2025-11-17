'use client'

import { useState } from 'react'
import { Startup } from '@/types/database'
import { StartupCard } from './StartupCard'
import { StartupDetailsModal } from './StartupDetailsModal'
import { Loader2 } from 'lucide-react'

interface StartupGridProps {
    startups: Startup[]
    loading?: boolean
}

export function StartupGrid({ startups, loading }: StartupGridProps) {
    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewDetails = (startup: Startup) => {
        setSelectedStartup(startup)
        setModalOpen(true)
    }
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (startups.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma startup encontrada</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups.map((startup) => (
                    <StartupCard
                        key={startup.id}
                        startup={startup}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>
            <StartupDetailsModal
                startup={selectedStartup}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </>
    )
}
