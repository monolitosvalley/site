'use client'

import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'

const calendarIframe = (
    <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FFortaleza&showPrint=0&src=bW9ub2xpdG9zdmFsbGV5QGdtYWlsLmNvbQ&src=YzRkMDQ2YTY3ODkyMWQxMWFjYzEzMjM1Yjk0NzIzNzE3NTEyYWIxMDVlNmI3YTY5MWVmNzAwNDIyNmI0Y2NmOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=cHQtYnIuYnJhemlsaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039be5&color=%23e67c73&color=%230b8043"
        style={{ border: 'solid 1px #777' }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
    />
)

export default function EventsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <AnimateOnScroll className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Agenda</h1>
                <p className="text-muted-foreground">
                    Eventos, meetups e oportunidades da comunidade Monólitos Valley
                </p>
            </AnimateOnScroll>

            <AnimateOnScroll>
                <div className="relative w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    {calendarIframe}
                </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Clique em um evento para salvar na sua agenda ou adicionar lembretes.
                </p>
            </AnimateOnScroll>
        </div>
    )
}
