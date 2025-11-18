import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, MessageCircle } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            icon: Instagram,
            href: 'https://instagram.com/monolitosvalley',
            label: 'Instagram',
        },
        {
            icon: Linkedin,
            href: 'https://linkedin.com/company/monolitosvalley',
            label: 'LinkedIn',
        },
        {
            icon: MessageCircle,
            href: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || '#',
            label: 'WhatsApp',
        },
    ]

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center">
                            {/* Mobile logo */}
                            <Image
                                src="/monolitos-valley-logo.svg"
                                alt="Monólitos Valley"
                                width={32}
                                height={32}
                                className="h-8 w-8 md:hidden"
                            />
                            {/* Desktop logo */}
                            <Image
                                src="/monolitos-valley-logo-title.svg"
                                alt="Monólitos Valley"
                                width={160}
                                height={40}
                                className="h-10 hidden md:block"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Ecossistema de inovação do Sertão Central Cearense
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => {
                            const Icon = social.icon
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    aria-label={social.label}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Monólitos Valley. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
