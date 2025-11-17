'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { Startup } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

interface StartupMapProps {
    startups: Startup[]
}

// Fix for default marker icon
const createCustomIcon = () => {
    return new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })
}

function MapBounds({ startups }: { startups: Startup[] }) {
    const map = useMap()

    useEffect(() => {
        if (startups.length > 0) {
            const bounds = startups
                .filter((s) => s.latitude && s.longitude)
                .map((s) => [s.latitude!, s.longitude!] as [number, number])

            if (bounds.length > 0) {
                map.fitBounds(bounds as any, { padding: [50, 50] })
            }
        }
    }, [startups, map])

    return null
}

export function StartupMap({ startups }: StartupMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="h-[600px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Carregando mapa...</p>
            </div>
        )
    }

    const startupsWithLocation = startups.filter((s) => s.latitude && s.longitude)

    if (startupsWithLocation.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                        Nenhuma startup com localização cadastrada ainda
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Centro padrão: Quixadá, CE
    const defaultCenter: LatLngExpression = [-4.9717, -39.0147]

    return (
        <div className="h-[600px] rounded-lg overflow-hidden border">
            <MapContainer
                center={defaultCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapBounds startups={startupsWithLocation} />
                {startupsWithLocation.map((startup) => (
                    <Marker
                        key={startup.id}
                        position={[startup.latitude!, startup.longitude!]}
                        icon={createCustomIcon()}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-semibold text-lg mb-2">{startup.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {startup.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {startup.segmento}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {startup.estagio_maturidade}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                    📍 {startup.cidade}, {startup.estado}
                                </p>
                                <Link
                                    href={`/startups?name=${startup.name}`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Ver detalhes →
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
