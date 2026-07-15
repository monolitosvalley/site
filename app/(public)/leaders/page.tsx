import leadersData from '@/data/leaders.json'
import {
    Users, Linkedin, Instagram, Award
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Leader {
    id: string
    full_name: string
    role_title: string
    startup_name: string | null
    linkedin_url: string | null
    instagram_url: string | null
    photo_url: string | null
}

export default function PublicLeadersPage() {
    const leaders = leadersData as Leader[]

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

                {/* Leaders Grid */}
                {leaders.length === 0 ? (
                    <div className="border border-slate-200/60 bg-slate-50 rounded-xl overflow-hidden">
                        <div className="py-16 text-center">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium text-lg">Nenhuma liderança encontrada</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {leaders.map(leader => (
                            <div
                                key={leader.id}
                                className="group border border-slate-200/60 bg-white hover:border-amber-300/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative rounded-xl"
                            >
                                <div className="p-4 pb-3">
                                    <div className="space-y-3">
                                        {leader.photo_url ? (
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                                <Image
                                                    src={leader.photo_url}
                                                    alt={leader.full_name || 'Avatar'}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    unoptimized
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
                                            <Award className="h-4 w-4 text-amber-500 flex-shrink-0 ml-1" />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2 pb-4 px-4 flex gap-2 border-t border-slate-100">
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
