'use client'

import { useState, useMemo, useEffect } from 'react'
import {
    Users, Linkedin, Instagram, Sparkles,
    ArrowUpRight, Loader2, Award, Zap, Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'

interface Leader {
    id: string
    full_name: string
    role_title: string
    startup_name: string | null
    linkedin_url: string | null
    instagram_url: string | null
    photo_url: string | null
    dedicated_hours?: number
    hours_approved?: boolean
    profiles?: {
        full_name: string | null
        email: string
        avatar_url: string | null
    } | null
}

type FilterType = 'all' | 'with-startup' | 'founders' | 'mentors'

export default function PublicLeadersPage() {
    const [leaders, setLeaders] = useState<Leader[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterType>('all')
    const supabase = createClient()

    useEffect(() => {
        async function fetchLeaders() {
            try {
                const { data, error } = await supabase
                    .from('community_leaders')
                    .select('*, profiles(full_name, email, avatar_url)')

                if (!error && data) {
                    const sorted = [...data].sort((a: any, b: any) => {
                        const aHasStartup = a.startup_name ? 1 : 0
                        const bHasStartup = b.startup_name ? 1 : 0
                        if (aHasStartup !== bHasStartup) return bHasStartup - aHasStartup

                        const nameA = a.profiles?.full_name || ''
                        const nameB = b.profiles?.full_name || ''
                        return nameA.localeCompare(nameB)
                    })
                    setLeaders(sorted)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaders()
    }, [])

    const stats = useMemo(() => ({
        total: leaders.length,
        withStartup: leaders.filter(l => l.startup_name).length,
        founders: leaders.filter(l => l.role_title?.toLowerCase().includes('founder')).length,
        mentors: leaders.filter(l => l.role_title?.toLowerCase().includes('mentor')).length,
    }), [leaders])

    const filteredLeaders = useMemo(() => {
        switch (filter) {
            case 'with-startup':
                return leaders.filter(l => l.startup_name)
            case 'founders':
                return leaders.filter(l => l.role_title?.toLowerCase().includes('founder'))
            case 'mentors':
                return leaders.filter(l => l.role_title?.toLowerCase().includes('mentor'))
            default:
                return leaders
        }
    }, [leaders, filter])

    const featuredLeaders = leaders.filter(l => l.startup_name).slice(0, 3)

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
                <p className="text-sm text-slate-500">Carregando lideranças...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="container mx-auto px-4 py-16 max-w-7xl">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">


                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900">
                        Lideranças que Movem
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mt-2">
                            a Comunidade
                        </span>
                    </h1>


                </div>



                {/* Filter Section */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={clsx(
                                'px-4 py-2.5 rounded-lg font-semibold transition-all duration-200',
                                filter === 'all'
                                    ? 'bg-amber-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            )}
                        >
                            Todos ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilter('with-startup')}
                            className={clsx(
                                'px-4 py-2.5 rounded-lg font-semibold transition-all duration-200',
                                filter === 'with-startup'
                                    ? 'bg-amber-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            )}
                        >
                            Com Startup ({stats.withStartup})
                        </button>
                        {stats.founders > 0 && (
                            <button
                                onClick={() => setFilter('founders')}
                                className={clsx(
                                    'px-4 py-2.5 rounded-lg font-semibold transition-all duration-200',
                                    filter === 'founders'
                                        ? 'bg-amber-600 text-white shadow-lg'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                )}
                            >
                                Fundadores ({stats.founders})
                            </button>
                        )}
                        {stats.mentors > 0 && (
                            <button
                                onClick={() => setFilter('mentors')}
                                className={clsx(
                                    'px-4 py-2.5 rounded-lg font-semibold transition-all duration-200',
                                    filter === 'mentors'
                                        ? 'bg-amber-600 text-white shadow-lg'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                )}
                            >
                                Mentores ({stats.mentors})
                            </button>
                        )}
                    </div>
                </div>

                {/* Leaders Grid */}
                {filteredLeaders.length === 0 ? (
                    <div className="border border-slate-200/60 bg-slate-50 rounded-xl overflow-hidden">
                        <div className="py-16 text-center">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium text-lg">Nenhuma liderança encontrada</p>
                            <p className="text-slate-500 text-sm mt-1">Tente ajustar seus filtros</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredLeaders.map(leader => (
                            <div
                                key={leader.id}
                                className="group border border-slate-200/60 bg-white hover:border-amber-300/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative rounded-xl"
                            >
                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

                                {/* Top accent */}
                                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

                                <div className="p-4 pb-3">
                                    <div className="space-y-3">
                                        {(leader.photo_url || leader.profiles?.avatar_url) ? (
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                                <Image
                                                    src={leader.photo_url || leader.profiles?.avatar_url!}
                                                    alt={leader.profiles?.full_name || 'Avatar'}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200 shadow-sm text-base">
                                                {(leader.profiles?.full_name || 'S').charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                                                {leader.profiles?.full_name || 'Sem nome'}
                                            </h3>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
                                                {leader.role_title}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {leader.startup_name && (
                                    <div className="px-4 py-3 flex-grow">
                                        <div className="bg-amber-50/70 border border-amber-200/40 rounded-lg p-2.5 flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Startup</p>
                                                <p className="text-xs font-semibold text-slate-800 truncate">{leader.startup_name}</p>
                                            </div>
                                            <Award className="h-4 w-4 text-amber-500 flex-shrink-0 ml-1" />
                                        </div>
                                    </div>
                                )}

                                {/* Dedicated Hours & Certificate Validation */}
                                <div className="px-4 pb-2 pt-2 flex items-center justify-between border-t border-slate-50 text-[11px]">
                                    <div className="flex items-center gap-1 font-semibold text-slate-500">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{leader.dedicated_hours || 0}h dedicadas</span>
                                    </div>
                                    {leader.hours_approved ? (
                                        <Badge className="bg-green-50 text-green-700 hover:bg-green-100/50 border-green-200 font-bold py-0 px-1.5 flex items-center gap-0.5 text-[9px]">
                                            <Award className="w-2.5 h-2.5 text-green-600" />
                                            <span>Certificado</span>
                                        </Badge>
                                    ) : (
                                        <span className="text-[9px] text-slate-400 font-medium italic">Pendente</span>
                                    )}
                                </div>

                                {/* Footer social links */}
                                <div className="pt-2 pb-4 px-4 flex gap-2 border-t border-slate-100 mt-auto">
                                    {leader.linkedin_url && (
                                        <Link
                                            href={leader.linkedin_url}
                                            target="_blank"
                                            className="flex-1 py-1.5 rounded-md bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
                                            title="LinkedIn"
                                        >
                                            <Linkedin className="h-3.5 w-3.5" />
                                        </Link>
                                    )}
                                    {leader.instagram_url && (
                                        <Link
                                            href={leader.instagram_url}
                                            target="_blank"
                                            className="flex-1 py-1.5 rounded-md bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-600 transition-all duration-200 flex items-center justify-center"
                                            title="Instagram"
                                        >
                                            <Instagram className="h-3.5 w-3.5" />
                                        </Link>
                                    )}
                                    {!leader.linkedin_url && !leader.instagram_url && (
                                        <div className="flex-1" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}