'use client'

import { Event } from '@/types/database'
import { EventCard } from './EventCard'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

interface EventCarouselProps {
    events: Event[]
}

export function EventCarousel({ events }: EventCarouselProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum evento disponível</p>
            </div>
        )
    }

    return (
        <Carousel
            opts={{
                align: 'start',
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
                {events.map((event) => (
                    <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                        <EventCard event={event} variant="carousel" />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
