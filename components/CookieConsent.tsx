'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie, X, Settings } from 'lucide-react'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface CookiePreferences {
    essential: boolean
    analytics: boolean
    functionality: boolean
}

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        functionality: false,
    })

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            // Show banner after 1 second
            setTimeout(() => setShowBanner(true), 1000)
        } else {
            // Load saved preferences
            try {
                const saved = JSON.parse(consent)
                setPreferences(saved)
                applyPreferences(saved)
            } catch (error) {
                console.error('Error loading cookie preferences:', error)
            }
        }
    }, [])

    const applyPreferences = (prefs: CookiePreferences) => {
        // Apply analytics cookies
        if (prefs.analytics) {
            enableAnalytics()
        } else {
            disableAnalytics()
        }

        // Apply functionality cookies
        if (prefs.functionality) {
            enableFunctionality()
        }
    }

    const enableAnalytics = () => {
        // Enable Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'granted'
            })
        }

        // Enable Microsoft Clarity
        if (typeof window !== 'undefined' && (window as any).clarity) {
            (window as any).clarity('consent')
        }
    }

    const disableAnalytics = () => {
        // Disable Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'denied'
            })
        }
    }

    const enableFunctionality = () => {
        // Enable functionality cookies
        localStorage.setItem('functionality-enabled', 'true')
    }

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem('cookie-consent', JSON.stringify(prefs))
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        setPreferences(prefs)
        applyPreferences(prefs)
        setShowBanner(false)
        setShowSettings(false)
    }

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            essential: true,
            analytics: true,
            functionality: true,
        }
        savePreferences(allAccepted)
    }

    const rejectOptional = () => {
        const essentialOnly: CookiePreferences = {
            essential: true,
            analytics: false,
            functionality: false,
        }
        savePreferences(essentialOnly)
    }

    const saveCustom = () => {
        savePreferences(preferences)
    }

    if (!showBanner) return null

    return (
        <>
            {/* Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-amber-500 shadow-2xl">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Cookie className="h-6 w-6 text-amber-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-stone-900 mb-2">
                                🍪 Nós usamos cookies
                            </h3>
                            <p className="text-sm text-stone-700 mb-4">
                                Usamos cookies essenciais para o funcionamento do site e cookies opcionais para
                                melhorar sua experiência e analisar o uso da plataforma. Você pode escolher quais
                                aceitar. Consulte nossa{' '}
                                <Link href="/cookies" className="text-amber-600 hover:text-amber-700 underline font-medium">
                                    Política de Cookies
                                </Link>
                                {' '}e{' '}
                                <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline font-medium">
                                    Política de Privacidade
                                </Link>
                                .
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={acceptAll}
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    Aceitar Todos
                                </Button>
                                <Button
                                    onClick={rejectOptional}
                                    variant="outline"
                                    className="border-stone-300"
                                >
                                    Apenas Essenciais
                                </Button>
                                <Button
                                    onClick={() => setShowSettings(true)}
                                    variant="ghost"
                                    className="text-stone-700"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Personalizar
                                </Button>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={rejectOptional}
                            className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors"
                            aria-label="Fechar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Cookie className="h-5 w-5 text-amber-600" />
                            Preferências de Cookies
                        </DialogTitle>
                        <DialogDescription>
                            Escolha quais tipos de cookies você deseja aceitar. Cookies essenciais são
                            necessários para o funcionamento do site e não podem ser desativados.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Essential */}
                        <div className="flex items-start justify-between gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Label className="text-base font-semibold text-green-900">
                                        Cookies Essenciais
                                    </Label>
                                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                        Obrigatório
                                    </span>
                                </div>
                                <p className="text-sm text-green-800">
                                    Necessários para autenticação, segurança e funcionamento básico da plataforma.
                                </p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>

                        {/* Analytics */}
                        <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                            <div className="flex-1">
                                <Label htmlFor="analytics" className="text-base font-semibold text-stone-900 mb-2 block">
                                    Cookies de Analytics
                                </Label>
                                <p className="text-sm text-stone-700 mb-2">
                                    Google Analytics e Microsoft Clarity para entender como você usa a plataforma
                                    e melhorar a experiência.
                                </p>
                                <p className="text-xs text-stone-600">
                                    Inclui: Páginas visitadas, tempo de permanência, cliques, mapas de calor
                                </p>
                            </div>
                            <Switch
                                id="analytics"
                                checked={preferences.analytics}
                                onCheckedChange={(checked) =>
                                    setPreferences({ ...preferences, analytics: checked })
                                }
                            />
                        </div>

                        {/* Functionality */}
                        <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                            <div className="flex-1">
                                <Label htmlFor="functionality" className="text-base font-semibold text-stone-900 mb-2 block">
                                    Cookies de Funcionalidade
                                </Label>
                                <p className="text-sm text-stone-700 mb-2">
                                    Lembram suas preferências e personalizam sua experiência na plataforma.
                                </p>
                                <p className="text-xs text-stone-600">
                                    Inclui: Tema, filtros salvos, startups visualizadas
                                </p>
                            </div>
                            <Switch
                                id="functionality"
                                checked={preferences.functionality}
                                onCheckedChange={(checked) =>
                                    setPreferences({ ...preferences, functionality: checked })
                                }
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button
                            onClick={() => setShowSettings(false)}
                            variant="ghost"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={saveCustom}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Salvar Preferências
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
