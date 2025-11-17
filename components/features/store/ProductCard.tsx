import { StoreProduct } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
    product: StoreProduct
}

export function ProductCard({ product }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price)

    return (
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            {product.image_url && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="text-lg font-semibold text-foreground">
                    {formattedPrice}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {product.description}
                    </p>
                )}
                <Button asChild className="w-full">
                    <a href={product.external_link} target="_blank" rel="noopener noreferrer">
                        Comprar
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}
