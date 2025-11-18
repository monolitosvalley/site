import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import StartupPageContent from './StartupPageContent'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: startup } = await supabase
        .from('startups')
        .select('name, description, logo_url, segmento')
        .eq('slug', slug)
        .single()

    if (!startup) {
        return {
            title: 'Startup não encontrada | Monólitos Valley',
        }
    }

    const title = `${startup.name} | Monólitos Valley`
    const description = startup.description || `Conheça ${startup.name}, startup de ${startup.segmento}`
    const imageUrl = startup.logo_url || 'https://monolitos-valley-portal.vercel.app/og-image.png'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: startup.name,
                },
            ],
            type: 'website',
            siteName: 'Monólitos Valley',
            locale: 'pt_BR',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    }
}

export default async function StartupPage({ params }: Props) {
    const { slug } = await params
    return <StartupPageContent slug={slug} />
}
