import { BlogPost } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BlogCardProps {
    post: BlogPost
    variant?: 'featured' | 'compact'
}

export function BlogCard({ post, variant = 'compact' }: BlogCardProps) {
    const createdDate = new Date(post.created_at)
    const formattedDate = format(createdDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

    // Create excerpt from content (first 150 characters)
    const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')

    if (variant === 'featured') {
        return (
            <Link href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {post.image_url && (
                        <div className="relative h-64 w-full">
                            <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="text-2xl">{post.title}</CardTitle>
                        <CardDescription>{excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={post.author.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {post.author.full_name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{post.author.full_name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formattedDate}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        )
    }

    return (
        <Link href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                    <div className="flex gap-4">
                        {post.image_url && (
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                            <CardDescription className="mt-2 line-clamp-2">{excerpt}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
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
                </CardContent>
            </Card>
        </Link>
    )
}
