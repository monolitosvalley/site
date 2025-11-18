import { Metadata } from 'next'
import Link from 'next/link'
import { Cookie, Settings, BarChart, Shield, Eye } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Política de Cookies | Monólitos Valley',
    description: 'Política de Cookies da Monólitos Valley - Como usamos cookies e tecnologias similares',
}

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Cookie className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900">Política de Cookies</h1>
                            <p className="text-sm text-stone-600">Última atualização: Novembro de 2024</p>
                        </div>
                    </div>
                    <p className="text-stone-700">
                        Esta política explica como a Monólitos Valley usa cookies e tecnologias similares
                        para melhorar sua experiência na plataforma.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-8">
                    {/* Seção 1 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Cookie className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">1. O que são Cookies?</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site.
                                Eles ajudam o site a lembrar suas preferências e melhorar sua experiência.
                            </p>
                            <p>
                                Usamos cookies e tecnologias similares como localStorage, sessionStorage e pixels de rastreamento.
                            </p>
                        </div>
                    </section>

                    {/* Seção 2 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">2. Tipos de Cookies que Usamos</h2>
                        </div>
                        <div className="space-y-6 text-stone-700">
                            {/* Essenciais */}
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-semibold text-green-900 mb-2">2.1 Cookies Essenciais (Obrigatórios)</h3>
                                <p className="mb-2">Necessários para o funcionamento básico da plataforma.</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Autenticação:</strong> Mantém você logado (Supabase Auth)</li>
                                    <li><strong>Segurança:</strong> Proteção contra CSRF e ataques</li>
                                    <li><strong>Sessão:</strong> Gerencia sua sessão de navegação</li>
                                    <li><strong>Preferências:</strong> Lembra suas configurações básicas</li>
                                </ul>
                                <p className="text-sm mt-2 text-green-800">
                                    ✓ Estes cookies não podem ser desativados pois são necessários para o funcionamento do site.
                                </p>
                            </div>

                            {/* Analytics */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="font-semibold text-blue-900 mb-2">2.2 Cookies de Analytics (Opcionais)</h3>
                                <p className="mb-2">Ajudam a entender como você usa a plataforma.</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Google Analytics:</strong> Análise de tráfego e comportamento</li>
                                    <li><strong>Microsoft Clarity:</strong> Mapas de calor e gravações de sessão</li>
                                    <li><strong>Métricas:</strong> Páginas visitadas, tempo de permanência, cliques</li>
                                </ul>
                                <p className="text-sm mt-2 text-blue-800">
                                    ⚙️ Você pode desativar estes cookies através do banner de consentimento.
                                </p>
                            </div>

                            {/* Funcionalidade */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-semibold text-purple-900 mb-2">2.3 Cookies de Funcionalidade (Opcionais)</h3>
                                <p className="mb-2">Melhoram sua experiência com recursos personalizados.</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Preferências:</strong> Tema, idioma, filtros salvos</li>
                                    <li><strong>Consentimento:</strong> Lembra suas escolhas de cookies</li>
                                    <li><strong>Visualizações:</strong> Lembra startups que você já viu</li>
                                </ul>
                                <p className="text-sm mt-2 text-purple-800">
                                    ⚙️ Você pode desativar estes cookies, mas algumas funcionalidades podem não funcionar corretamente.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Seção 3 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">3. Ferramentas de Terceiros</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">3.1 Google Analytics</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Coleta dados anônimos sobre uso da plataforma</li>
                                    <li>Ajuda a melhorar funcionalidades e conteúdo</li>
                                    <li>Política de privacidade: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy</a></li>
                                    <li>Opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">3.2 Microsoft Clarity</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Grava sessões de navegação (anonimizadas)</li>
                                    <li>Cria mapas de calor para melhorar UX</li>
                                    <li>Não coleta informações pessoais identificáveis</li>
                                    <li>Política de privacidade: <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Privacy</a></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Seção 4 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">4. Duração dos Cookies</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">Cookies de Sessão</h3>
                                <p>Expiram quando você fecha o navegador. Usados para autenticação temporária.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Cookies Persistentes</h3>
                                <p>Permanecem no seu dispositivo por um período específico:</p>
                                <ul className="list-disc pl-6 space-y-1 mt-2">
                                    <li><strong>Autenticação:</strong> Até 30 dias</li>
                                    <li><strong>Preferências:</strong> Até 1 ano</li>
                                    <li><strong>Analytics:</strong> Até 2 anos (Google Analytics)</li>
                                    <li><strong>Consentimento:</strong> Até 1 ano</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Seção 5 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">5. Como Gerenciar Cookies</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">5.1 Banner de Consentimento</h3>
                                <p>
                                    Ao visitar pela primeira vez, você verá um banner solicitando consentimento.
                                    Você pode aceitar todos, rejeitar opcionais ou personalizar suas preferências.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">5.2 Configurações do Navegador</h3>
                                <p>Você pode gerenciar cookies através do seu navegador:</p>
                                <ul className="list-disc pl-6 space-y-1 mt-2">
                                    <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                                    <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
                                    <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                                    <li><strong>Edge:</strong> Configurações → Cookies e permissões de site</li>
                                </ul>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-900">
                                    <strong>⚠️ Atenção:</strong> Bloquear todos os cookies pode afetar o funcionamento da plataforma,
                                    incluindo a impossibilidade de fazer login.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Seção 6 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">6. Seus Direitos</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Você tem direito a:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Saber quais cookies estão sendo usados</li>
                                <li>Aceitar ou rejeitar cookies não essenciais</li>
                                <li>Alterar suas preferências a qualquer momento</li>
                                <li>Solicitar exclusão de dados coletados via cookies</li>
                            </ul>
                        </div>
                    </section>

                    {/* Seção 7 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">7. Atualizações</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Podemos atualizar esta política periodicamente para refletir mudanças em nossas práticas
                                ou requisitos legais. A data da última atualização está no topo desta página.
                            </p>
                        </div>
                    </section>

                    {/* Seção 8 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-orange-600" />
                            <h2 className="text-xl font-bold text-stone-900">8. Contato</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Para questões sobre cookies:</p>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mt-4">
                                <p><strong>E-mail:</strong> privacidade@monolitosvalley.com</p>
                                <p><strong>Endereço:</strong> Quixadá, CE - Brasil</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                        Política de Privacidade
                    </Link>
                    <Link href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                        Termos de Uso
                    </Link>
                    <Link href="/" className="text-stone-600 hover:text-stone-700">
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        </div>
    )
}
