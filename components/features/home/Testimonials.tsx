import { Star } from 'lucide-react'
import Image from 'next/image'

interface Testimonial {
    id: string
    name: string
    role: string
    company: string
    content: string
    avatar?: string
    rating?: number
}

interface TestimonialsProps {
    testimonials: Testimonial[]
    title?: string
    subtitle?: string
}

export function Testimonials({
    testimonials,
    title = 'O que dizem nossos membros',
    subtitle = 'Histórias reais de quem faz parte da comunidade',
}: TestimonialsProps) {
    return (
        <section className="py-20 bg-stone-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-3">{title}</h2>
                    <p className="text-stone-400 text-lg">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-stone-800 border border-stone-700 rounded-lg p-8 hover:border-amber-500/50 transition-colors"
                        >
                            {/* Rating */}
                            {testimonial.rating && (
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Content */}
                            <p className="text-stone-300 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                {testimonial.avatar ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-lg">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-amber-400">{testimonial.role}</p>
                                    <p className="text-xs text-stone-500">{testimonial.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
