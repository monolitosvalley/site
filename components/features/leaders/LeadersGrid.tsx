'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface Leader {
    id: string
    full_name: string
    role_title: string
    startup_name: string | null
    linkedin_url: string | null
    instagram_url: string | null
    photo_url: string | null
}

interface LeadersGridProps {
    leaders: Leader[]
}

export function LeadersGrid({ leaders }: LeadersGridProps) {
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!gridRef.current) return

        const ctx = gsap.context(() => {
            const cards = gridRef.current?.querySelectorAll('[data-leader-card]')
            if (!cards || cards.length === 0) return

            gsap.fromTo(cards,
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        }, gridRef)

        return () => ctx.revert()
    }, [])

    if (leaders.length === 0) return null

    return (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {leaders.map((leader) => (
                <div
                    key={leader.id}
                    data-leader-card
                    className="group border border-slate-200/60 bg-white hover:border-amber-300/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative rounded-xl"
                >
                    <div className="p-4 pb-3">
                        <div className="space-y-3">
                            {leader.photo_url ? (
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                    <img
                                        src={leader.photo_url}
                                        alt={leader.full_name || 'Avatar'}
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200 shadow-sm text-base">
                                    {(leader.full_name || 'S').charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                                    {leader.full_name || 'Sem nome'}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
                                    {leader.role_title}
                                </p>
                            </div>
                        </div>
                    </div>

                    {leader.startup_name && (
                        <div className="px-4 py-3">
                            <div className="bg-amber-50/70 border border-amber-200/40 rounded-lg p-2.5 flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Startup</p>
                                    <p className="text-xs font-semibold text-slate-800 truncate">{leader.startup_name}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-500 flex-shrink-0 ml-1"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                            </div>
                        </div>
                    )}

                    <div className="pt-2 pb-4 px-4 flex gap-2 border-t border-slate-100">
                        {leader.linkedin_url && (
                            <a
                                href={leader.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 rounded-md bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
                                title="LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                        )}
                        {leader.instagram_url && (
                            <a
                                href={leader.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 rounded-md bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-600 transition-all duration-200 flex items-center justify-center"
                                title="Instagram"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                        )}
                        {!leader.linkedin_url && !leader.instagram_url && (
                            <div className="flex-1" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
