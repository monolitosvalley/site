'use client'

import { BlogPost } from '@/types/database'
import { BlogCard } from './BlogCard'
import { Loader2 } from 'lucide-react'

interface BlogGridProps {
    posts: BlogPost[]
    loading?: boolean
}

export function BlogGrid({ posts, loading }: BlogGridProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum post encontrado</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    )
}
