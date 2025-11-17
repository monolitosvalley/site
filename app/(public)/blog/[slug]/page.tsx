import { BlogPost } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { notFound } from 'next/navigation'

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog-posts/${slug}`, {
            cache: 'no-store',
        })
        if (!res.ok) return null
        const data = await res.json()
        return data.data
    } catch {
        return null
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        notFound()
    }

    const createdDate = new Date(post.created_at)
    const formattedDate = format(createdDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            {post.image_url && (
                <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                    <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                </div>
            )}

            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center gap-4 text-muted-foreground">
                    {post.author && (
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={post.author.avatar_url || undefined} />
                                <AvatarFallback>{post.author.full_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span>{post.author.full_name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                    </div>
                </div>
            </header>

            <div className="prose prose-lg max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                        {paragraph}
                    </p>
                ))}
            </div>
        </article>
    )
}
