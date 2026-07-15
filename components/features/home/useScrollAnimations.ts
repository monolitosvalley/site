'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export function useScrollAnimations() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            const sections = containerRef.current?.querySelectorAll('[data-animate]')
            if (!sections || sections.length === 0) return

            gsap.fromTo(sections,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: sections[0],
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return containerRef
}
