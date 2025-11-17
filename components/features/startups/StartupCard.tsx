import { Startup } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Leaf } from 'lucide-react'
import Image from 'next/image'

interface StartupCardProps {
    startup: Startup
    variant?: 'compact' | 'detailed'
}

export function StartupCard({ startup, variant = 'compact' }: StartupCardProps) {
    return (
        <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start gap-4">
                    {startup.logo_url ? (
                        <Image
                            src={startup.logo_url}
                            alt={`${startup.name} logo`}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <CardTitle className="flex items-center gap-2">
                            {startup.name}
                            {startup.is_esg && (
                                <Badge variant="secondary" className="gap-1">
                                    <Leaf className="w-3 h-3" />
                                    ESG
                                </Badge>
                            )}
                        </CardTitle>
                        {startup.segmento && (
                            <CardDescription className="mt-1">{startup.segmento}</CardDescription>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {startup.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {startup.description}
                    </p>
                )}
                <div className="flex flex-wrap gap-2">
                    {startup.estagio_maturidade && (
                        <Badge variant="outline">{startup.estagio_maturidade}</Badge>
                    )}
                    {variant === 'detailed' && startup.tecnologias_utilizadas.length > 0 && (
                        <>
                            {startup.tecnologias_utilizadas.slice(0, 3).map((tech: string) => (
                                <Badge key={tech} variant="secondary">
                                    {tech}
                                </Badge>
                            ))}
                            {startup.tecnologias_utilizadas.length > 3 && (
                                <Badge variant="secondary">+{startup.tecnologias_utilizadas.length - 3}</Badge>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
