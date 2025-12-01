'use client'

import { useState } from 'react'
import { Event } from '@/types/database'
import { EventCard } from './EventCard'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EventCarouselProps {
    events: Event[]
}

export function EventCarousel({ events }: EventCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useState(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap())
        })
    })

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum evento disponível</p>
            </div>
        )
    }

    return (
        <div className="relative">
            <Carousel
                opts={{
                    align: 'start',
                    loop: events.length > 3,
                }}
                setApi={setApi}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {events.map((event) => (
                        <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                            <EventCard event={event} variant="carousel" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Botões de navegação e indicadores */}
            {events.length > 3 && (
                <div className="flex flex-col items-center gap-3 mt-6">
                    {/* Indicadores de página */}
                    <div className="flex gap-2">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 rounded-full transition-all ${index === current
                                        ? 'w-8 bg-[#F2CB05]'
                                        : 'w-2 bg-stone-300 hover:bg-stone-400'
                                    }`}
                                onClick={() => api?.scrollTo(index)}
                                aria-label={`Ir para página ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Botões de navegação */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => api?.scrollPrev()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Anterior</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => api?.scrollNext()}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Próximo</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
