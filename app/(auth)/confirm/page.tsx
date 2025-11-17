'use client'

import { Loader2, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ConfirmPage() {
    const [confirmed, setConfirmed] = useState(false)

    useEffect(() => {
        // Simulate confirmation after a short delay
        const timer = setTimeout(() => {
            setConfirmed(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="text-center space-y-4">
                {!confirmed ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                        <h1 className="text-2xl font-bold">Autenticando...</h1>
                        <p className="text-muted-foreground">
                            Estamos processando seu acesso. Você será redirecionado em breve.
                        </p>
                    </>
                ) : (
                    <>
                        <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
                        <h1 className="text-2xl font-bold">Bem-vindo!</h1>
                        <p className="text-muted-foreground">
                            Autenticação concluída. Redirecionando para seu perfil...
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
