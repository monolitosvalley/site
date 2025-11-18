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

export function EventCard({ event, variant = 'list' }: EventCardProps) {
    const formattedDate = event.date
        ? format(new Date(event.date), "d 'de' MMMM", { locale: ptBR })
        : 'Data não definida'

    const time = event.start_time || ''

    if (variant === 'carousel') {
        return (
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
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
                            {time && <span className="text-stone-600">{time}</span>}
                        </span>
                        {event.location && (
                            <span className="flex items-center gap-2 text-stone-600">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold">
                        Inscrever-se
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
                                {time && <span className="text-stone-600">{time}</span>}
                            </span>
                            {event.location && (
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                    {event.location}
                                </span>
                            )}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            {event.description && (
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </CardContent>
            )}
        </Card>
    )
}
