'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface AnimateOnScrollProps {
    children: React.ReactNode
    className?: string
    y?: number
    duration?: number
    stagger?: number
    trigger?: string | HTMLElement
}

export function AnimateOnScroll({
    children,
    className = '',
    y = 24,
    duration = 0.7,
    stagger = 0.1,
    trigger,
}: AnimateOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current?.children || [],
                { opacity: 0, y },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    ease: 'power2.out',
                    stagger,
                    scrollTrigger: {
                        trigger: trigger || ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        }, ref)

        return () => ctx.revert()
    }, [y, duration, stagger, trigger])

    return <div ref={ref} className={className}>{children}</div>
}
