'use client'

import { Profile } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Briefcase, Globe, BookOpen, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface TeamMember {
    id: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    role?: string
    linkedin?: string
    github?: string
    behance?: string
    portfolio?: string
    lattes?: string
    instagram?: string
    outros?: string
}

interface TeamMembersProps {
    members: TeamMember[]
    title?: string
}

const SOCIAL_ICONS: Record<string, any> = {
    linkedin: Linkedin,
    github: Github,
    behance: Briefcase,
    portfolio: Globe,
    lattes: BookOpen,
    instagram: Instagram,
}

export function TeamMembers({ members, title = 'Time' }: TeamMembersProps) {
    if (!members || members.length === 0) {
        return null
    }

    return (
        <div>
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-4 hover:border-amber-500 transition-colors"
                    >
                        {/* Avatar */}
                        <div className="flex items-start gap-3 mb-3">
                            {member.avatar_url ? (
                                <Image
                                    src={member.avatar_url}
                                    alt={member.full_name || 'Membro'}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                    {member.full_name?.charAt(0) || 'M'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-stone-900 truncate">
                                    {member.full_name || 'Sem nome'}
                                </p>
                                {member.role && (
                                    <p className="text-xs text-amber-600 font-medium">{member.role}</p>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {member.bio && (
                            <p className="text-xs text-stone-600 mb-3 line-clamp-2">{member.bio}</p>
                        )}

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2">
                            {member.linkedin && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="LinkedIn"
                                >
                                    <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4 text-blue-600" />
                                    </Link>
                                </Button>
                            )}
                            {member.github && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="GitHub"
                                >
                                    <Link href={member.github} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4 text-stone-800" />
                                    </Link>
                                </Button>
                            )}
                            {member.behance && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="Behance"
                                >
                                    <Link href={member.behance} target="_blank" rel="noopener noreferrer">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                    </Link>
                                </Button>
                            )}
                            {member.portfolio && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="Portfólio"
                                >
                                    <Link href={member.portfolio} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-4 w-4 text-amber-600" />
                                    </Link>
                                </Button>
                            )}
                            {member.lattes && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="Lattes"
                                >
                                    <Link href={member.lattes} target="_blank" rel="noopener noreferrer">
                                        <BookOpen className="h-4 w-4 text-red-600" />
                                    </Link>
                                </Button>
                            )}
                            {member.instagram && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="Instagram"
                                >
                                    <Link href={member.instagram} target="_blank" rel="noopener noreferrer">
                                        <Instagram className="h-4 w-4 text-pink-600" />
                                    </Link>
                                </Button>
                            )}
                            {member.outros && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="Outros"
                                >
                                    <Link href={member.outros} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-4 w-4 text-stone-600" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
