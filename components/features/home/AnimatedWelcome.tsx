'use client'

import { useEffect, useState } from 'react'

interface AnimatedWelcomeProps {
    className?: string
}

export function AnimatedWelcome({ className = '' }: AnimatedWelcomeProps) {
    const [displayText, setDisplayText] = useState('Bem-vindx')

    // Variações criativas e inclusivas
    const variations = [
        'Bem-vindo',
        'Bem-vinda',
        'Bem-vindex',
        'Bem-vindos',
        'Bem-vindas',
        'Bem-vindus',
        'Bem-vindis',
        'Bem-vindxs',
    ]

    useEffect(() => {
        let currentIndex = 0

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % variations.length
            setDisplayText(variations[currentIndex])
        }, 3000) // Muda a cada 3 segundos

        return () => clearInterval(interval)
    }, [])

    return (
        <span className={`inline-block transition-all duration-300 ${className}`}>
            {displayText}
        </span>
    )
}
