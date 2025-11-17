'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

interface LocationPickerProps {
    initialLat?: number
    initialLng?: number
    cidade?: string
    estado?: string
    onLocationSelect: (lat: number, lng: number) => void
}

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

function LocationMarker({
    position,
    onPositionChange,
}: {
    position: LatLngExpression | null
    onPositionChange: (lat: number, lng: number) => void
}) {
    useMapEvents({
        click(e) {
            onPositionChange(e.latlng.lat, e.latlng.lng)
        },
    })

    return position ? <Marker position={position} icon={createCustomIcon()} /> : null
}

export function LocationPicker({
    initialLat,
    initialLng,
    cidade,
    estado,
    onLocationSelect,
}: LocationPickerProps) {
    const [mounted, setMounted] = useState(false)
    const [position, setPosition] = useState<LatLngExpression | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    )
    const [showMap, setShowMap] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (initialLat && initialLng) {
            setPosition([initialLat, initialLng])
        }
    }, [initialLat, initialLng])

    const handlePositionChange = (lat: number, lng: number) => {
        setPosition([lat, lng])
        onLocationSelect(lat, lng)
    }

    const handleClearLocation = () => {
        setPosition(null)
        onLocationSelect(0, 0)
    }

    // Centro baseado na cidade/estado ou padrão Quixadá
    const getDefaultCenter = (): LatLngExpression => {
        if (position) return position

        // Coordenadas aproximadas de algumas cidades do Sertão Central
        const cidadesCoords: { [key: string]: LatLngExpression } = {
            quixadá: [-4.9717, -39.0147],
            quixeramobim: [-5.1978, -39.2906],
            senador_pompeu: [-5.5878, -39.3697],
            'senador pompeu': [-5.5878, -39.3697],
        }

        const cidadeKey = cidade?.toLowerCase().replace(/\s+/g, '_')
        if (cidadeKey && cidadesCoords[cidadeKey]) {
            return cidadesCoords[cidadeKey]
        }

        return [-4.9717, -39.0147] // Quixadá padrão
    }

    if (!mounted) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização no Mapa
                </CardTitle>
                <CardDescription>
                    {position
                        ? 'Clique no mapa para ajustar a localização da sua startup'
                        : 'Clique no mapa para marcar a localização da sua startup'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {position && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="text-sm">
                            <p className="font-medium">Localização selecionada</p>
                            <p className="text-muted-foreground">
                                Lat: {(position as number[])[0].toFixed(6)}, Lng:{' '}
                                {(position as number[])[1].toFixed(6)}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleClearLocation}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {!showMap && (
                    <Button onClick={() => setShowMap(true)} className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        {position ? 'Ajustar Localização' : 'Selecionar no Mapa'}
                    </Button>
                )}

                {showMap && (
                    <div className="space-y-2">
                        <div className="h-[400px] rounded-lg overflow-hidden border">
                            <MapContainer
                                center={getDefaultCenter()}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker position={position} onPositionChange={handlePositionChange} />
                            </MapContainer>
                        </div>
                        <Button variant="outline" onClick={() => setShowMap(false)} className="w-full">
                            Fechar Mapa
                        </Button>
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    💡 Dica: A localização ajuda outros membros da comunidade a encontrarem startups próximas
                    e facilita conexões regionais.
                </p>
            </CardContent>
        </Card>
    )
}
