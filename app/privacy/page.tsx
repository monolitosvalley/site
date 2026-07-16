import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, Mail, Users, FileText } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Política de Privacidade | Monólitos Valley',
    description: 'Política de Privacidade da Monólitos Valley - Como coletamos, usamos e protegemos seus dados',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900">Política de Privacidade</h1>
                            <p className="text-sm text-stone-600">Última atualização: Novembro de 2024</p>
                        </div>
                    </div>
                    <p className="text-stone-700">
                        A Monólitos Valley está comprometida com a proteção da sua privacidade e dos seus dados pessoais.
                        Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-8">
                    {/* Seção 1 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">1. Dados que Coletamos</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">1.1 Dados Fornecidos por Você</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Nome completo e e-mail (para cadastro)</li>
                                    <li>Informações da startup (nome, CNPJ, descrição, localização)</li>
                                    <li>Dados de membros do time (nome, função, redes sociais)</li>
                                    <li>Documentos enviados (logos, pitch decks)</li>
                                    <li>Informações de perfil e preferências</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">1.2 Dados Coletados Automaticamente</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Endereço IP e localização aproximada</li>
                                    <li>Tipo de navegador e dispositivo</li>
                                    <li>Páginas visitadas e tempo de navegação</li>
                                    <li>Cookies e tecnologias similares</li>
                                    <li>Dados de analytics (Google Analytics, Microsoft Clarity)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Seção 2 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">2. Como Usamos Seus Dados</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Prestação de Serviços:</strong> Criar e gerenciar sua conta, exibir perfil da startup</li>
                                <li><strong>Comunicação:</strong> Enviar notificações sobre encontros, oportunidades e atualizações via Brevo SMTP</li>
                                <li><strong>Melhorias:</strong> Analisar uso da plataforma para melhorar funcionalidades</li>
                                <li><strong>Segurança:</strong> Prevenir fraudes e proteger a plataforma</li>
                                <li><strong>Marketing:</strong> Enviar newsletters e conteúdo relevante (com seu consentimento)</li>
                                <li><strong>Compartilhamento Público:</strong> Dados públicos das startups são exibidos no portal e podem ser compartilhados com parceiros do ecossistema</li>
                            </ul>
                        </div>
                    </section>

                    {/* Seção 3 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">3. Compartilhamento de Dados</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p><strong>Dados Públicos das Startups:</strong></p>
                            <ul className="list-disc pl-6 space-y-1 mb-4">
                                <li>Nome, logo, descrição e informações de contato</li>
                                <li>Dados de membros do time (quando fornecidos)</li>
                                <li>Localização, segmento e estágio de maturidade</li>
                                <li>Estes dados podem ser compartilhados com parceiros, investidores e membros da comunidade</li>
                            </ul>
                            <p><strong>Dados Privados:</strong></p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>E-mail, senha e dados de autenticação são mantidos privados</li>
                                <li>Não vendemos seus dados pessoais para terceiros</li>
                                <li>Compartilhamos apenas com prestadores de serviços essenciais (Supabase, Brevo)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Seção 4 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">4. Armazenamento e Segurança</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">4.1 Onde Armazenamos</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Supabase:</strong> Banco de dados e autenticação (servidores seguros)</li>
                                    <li><strong>Supabase Storage:</strong> Arquivos (logos, pitch decks, fotos)</li>
                                    <li><strong>Brevo:</strong> Gerenciamento de e-mails e comunicações</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">4.2 Medidas de Segurança</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Criptografia SSL/TLS para transmissão de dados</li>
                                    <li>Senhas criptografadas com bcrypt</li>
                                    <li>Autenticação segura via magic link</li>
                                    <li>Backups regulares e redundância</li>
                                    <li>Controle de acesso baseado em permissões (RLS)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Seção 5 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">5. Seus Direitos (LGPD/GDPR)</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Você tem direito a:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
                                <li><strong>Correção:</strong> Atualizar dados incorretos ou incompletos</li>
                                <li><strong>Exclusão:</strong> Solicitar remoção dos seus dados (direito ao esquecimento)</li>
                                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                                <li><strong>Oposição:</strong> Opor-se ao processamento de dados para marketing</li>
                                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                            </ul>
                            <p className="mt-4">
                                Para exercer seus direitos, acesse seu perfil ou entre em contato conosco.
                            </p>
                        </div>
                    </section>

                    {/* Seção 6 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">6. Cookies e Tecnologias</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Utilizamos cookies para:</p>
                            <ul className="list-disc pl-6 space-y-1 mb-4">
                                <li><strong>Essenciais:</strong> Autenticação e funcionamento básico</li>
                                <li><strong>Analytics:</strong> Google Analytics e Microsoft Clarity para análise de uso</li>
                                <li><strong>Preferências:</strong> Salvar suas configurações</li>
                            </ul>
                            <p>
                                Você pode gerenciar suas preferências de cookies através do banner de consentimento ou nas configurações do navegador.
                                Consulte nossa <Link href="/cookies" className="text-amber-600 hover:text-amber-700 underline">Política de Cookies</Link> para mais detalhes.
                            </p>
                        </div>
                    </section>

                    {/* Seção 7 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">7. Retenção de Dados</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Mantemos seus dados enquanto sua conta estiver ativa</li>
                                <li>Após exclusão da conta, dados são removidos em até 30 dias</li>
                                <li>Alguns dados podem ser mantidos por obrigações legais (ex: dados fiscais)</li>
                                <li>Logs de segurança são mantidos por até 12 meses</li>
                            </ul>
                        </div>
                    </section>

                    {/* Seção 8 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">8. Alterações nesta Política</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas
                                por e-mail ou através de aviso na plataforma. A data da última atualização está no topo desta página.
                            </p>
                        </div>
                    </section>

                    {/* Seção 9 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-5 w-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-stone-900">9. Contato</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Para questões sobre privacidade ou exercer seus direitos:</p>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mt-4">
                                <p><strong>E-mail:</strong> privacidade@monolitosvalley.com</p>
                                <p><strong>Endereço:</strong> Quixadá, CE - Brasil</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                    <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                        Termos de Uso
                    </Link>
                    <Link href="/cookies" className="text-amber-600 hover:text-amber-700 underline">
                        Política de Cookies
                    </Link>
                    <Link href="/" className="text-stone-600 hover:text-stone-700">
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        </div>
    )
}
