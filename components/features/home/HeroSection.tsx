'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedWelcome } from './AnimatedWelcome'

interface HeroSectionProps {
    subtitle: string
    cta?: {
        text: string
        href: string
    }
    stats?: Array<{
        value: string
        label: string
    }>
}

export function HeroSection({ subtitle, cta, stats }: HeroSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width
            const y = (e.clientY - rect.top) / rect.height

            setMousePosition({ x, y })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const offsetX = (mousePosition.x - 0.5) * 20
    const offsetY = (mousePosition.y - 0.5) * 20

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white py-24 md:py-32 min-h-screen flex items-center"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1200 600">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="1200" height="600" fill="url(#grid)" />
                </svg>

                {/* Floating Orbs with Parallax */}
                <div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full blur-3xl"
                    style={{
                        transform: `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`,
                        transition: 'transform 0.3s ease-out',
                    }}
                />
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-full blur-3xl"
                    style={{
                        transform: `translate(${offsetX * -0.3}px, ${offsetY * -0.3}px)`,
                        transition: 'transform 0.3s ease-out',
                    }}
                />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Title with Animated Welcome */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                        <div className="block text-white mb-6">
                            <AnimatedWelcome className="text-white" /> à
                        </div>

                        {/* Logo - Centered and Larger */}
                        <div className="flex justify-center mb-6">
                            <Image
                                src="/monolitos-valley-logo-title.svg"
                                alt="Monólitos Valley"
                                width={400}
                                height={100}
                                className="h-20 md:h-28 w-auto object-contain"
                                priority
                            />
                        </div>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-stone-300 mb-8 max-w-2xl mx-auto">
                        {subtitle}
                    </p>


                    {/* CTA Buttons */}
                    {cta && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                                asChild
                            >
                                <Link href={cta.href}>
                                    {cta.text}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Stats */}
                    {stats && stats.length > 0 && (
                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-stone-700">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <p className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-stone-400 text-sm md:text-base">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-100 to-transparent" />
        </section>
    )
}
