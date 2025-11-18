'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
    id: string
    question: string
    answer: string
}

interface FAQProps {
    items: FAQItem[]
    title?: string
    subtitle?: string
}

export function FAQ({ items, title = 'Dúvidas Frequentes', subtitle = 'Tudo que você precisa saber antes de entrar' }: FAQProps) {
    const [openId, setOpenId] = useState<string | null>(items[0]?.id || null)

    return (
        <section className="py-20 bg-stone-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-stone-900 mb-3">{title}</h2>
                    <p className="text-stone-600 text-lg">{subtitle}</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="border-2 border-amber-200 rounded-lg overflow-hidden bg-white hover:border-amber-400 transition-colors"
                        >
                            <button
                                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-amber-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-stone-900 text-left">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-amber-600 flex-shrink-0 transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {openId === item.id && (
                                <div className="px-6 py-4 border-t-2 border-amber-100 bg-amber-50">
                                    <p className="text-stone-700 leading-relaxed">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
