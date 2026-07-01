import { Event } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

interface EventCardProps {
    event: Event
    variant?: 'carousel' | 'list' | 'calendar'
}

function getGoogleCalendarUrl(event: Event) {
    const title = encodeURIComponent(event.title)
    const desc = encodeURIComponent(event.description || '')
    const loc = encodeURIComponent(event.address || event.location || event.link || '')
    
    // Parse date
    const dateValue = event.event_date || event.date
    const date = dateValue ? new Date(dateValue) : new Date()
    
    // End date + 1 hour by default
    const endDate = new Date(date.getTime() + 60 * 60 * 1000)
    
    const formatCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
    
    const dates = `${formatCalDate(date)}/${formatCalDate(endDate)}`
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${desc}&location=${loc}`
}

export function EventCard({ event, variant = 'list' }: EventCardProps) {
    // Usar event_date (novo) ou date (antigo) para compatibilidade
    const dateValue = event.event_date || event.date
    const formattedDate = dateValue
        ? format(new Date(dateValue), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
        : 'Data não definida'

    const time = event.start_time || ''

    if (variant === 'carousel') {
        return (
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col pt-0">
                {event.image_url && (
                    <div className="relative h-56 w-full overflow-hidden bg-stone-200">
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <CardHeader className="flex-1 flex flex-col">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="flex flex-col gap-2 mt-3">
                        <span className="flex items-center gap-2 text-amber-600 font-medium">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                        {event.address && (
                            <span className="flex items-center gap-2 text-stone-600">
                                <MapPin className="w-4 h-4" />
                                {event.address}
                            </span>
                        )}
                        {event.link && (
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                            >
                                🔗 Link do evento
                            </a>
                        )}
                        {event.location && !event.address && !event.link && (
                            <span className="flex items-center gap-2 text-stone-600">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex gap-2">
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                        Inscrever-se
                    </Button>
                    <Button variant="outline" size="icon" className="hover:text-amber-600 hover:border-amber-500" title="Adicionar à Agenda" asChild>
                        <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                            📅
                        </a>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex gap-4">
                    {event.image_url && (
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-stone-200">
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="flex flex-col gap-2 mt-2">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <span className="text-amber-600 font-medium">{formattedDate}</span>
                            </span>
                            {event.address && (
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                    {event.address}
                                </span>
                            )}
                            {event.link && (
                                <a
                                    href={event.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                                >
                                    🔗 Link do evento
                                </a>
                            )}
                            {event.location && !event.address && !event.link && (
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                    {event.location}
                                </span>
                            )}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            {event.description ? (
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{event.description}</p>
                    <Button size="sm" variant="outline" className="text-xs font-semibold gap-1 text-stone-600 hover:text-amber-600 hover:border-amber-500 sm:self-end" asChild>
                        <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                            📅 Adicionar à Agenda
                        </a>
                    </Button>
                </CardContent>
            ) : (
                <CardContent className="flex justify-end pb-4 pt-0">
                    <Button size="sm" variant="outline" className="text-xs font-semibold gap-1 text-stone-600 hover:text-amber-600 hover:border-amber-500" asChild>
                        <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                            📅 Adicionar à Agenda
                        </a>
                    </Button>
                </CardContent>
            )}
        </Card>
    )
}
