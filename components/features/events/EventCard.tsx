import { Event } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'

interface EventCardProps {
    event: Event
    variant?: 'carousel' | 'list' | 'calendar'
}

export function EventCard({ event, variant = 'list' }: EventCardProps) {
    const eventDate = new Date(event.event_date)
    const formattedDate = format(eventDate, "dd/MM/yyyy 'às' HH:mm")

    if (variant === 'carousel') {
        return (
            <Card className="overflow-hidden">
                {event.image_url && (
                    <div className="relative h-48 w-full">
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                    </CardDescription>
                </CardHeader>
                {event.location && (
                    <CardContent>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                        </p>
                    </CardContent>
                )}
            </Card>
        )
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex gap-4">
                    {event.image_url && (
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                        />
                    )}
                    <div className="flex-1">
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </CardDescription>
                        {event.location && (
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                            </CardDescription>
                        )}
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
