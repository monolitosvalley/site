'use client'

import { useState, useEffect } from 'react'
import { StoreProduct } from '@/types/database'
import { ProductCard } from '@/components/features/store/ProductCard'
import { Loader2 } from 'lucide-react'

export default function StorePage() {
    const [products, setProducts] = useState<StoreProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/store-products')
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data.data || [])
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Lojinha</h1>
                <p className="text-muted-foreground">
                    Produtos e recursos exclusivos para a comunidade
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum produto disponível no momento</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
