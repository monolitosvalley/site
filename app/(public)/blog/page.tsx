'use client'

import { useState, useEffect } from 'react'
import { BlogPost } from '@/types/database'
import { BlogGrid } from '@/components/features/blog/BlogGrid'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true)
            try {
                const res = await fetch(`/api/blog-posts?page=${page}&limit=9`)
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data.data || [])
                    setTotalPages(data.totalPages || 1)
                }
            } catch (error) {
                console.error('Error fetching blog posts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [page])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Blog</h1>
                <p className="text-muted-foreground">
                    Notícias, insights e histórias do ecossistema de inovação
                </p>
            </div>

            <BlogGrid posts={posts} loading={loading} />

            {/* Pagination */}
            {totalPages > 1 && !loading && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Próxima
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
