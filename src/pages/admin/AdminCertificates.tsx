import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { fetchCertificadosStats, gerarCertificados, enviarCertificados } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import {
    Award,
    Send,
    CheckCircle2,
    Users,
    Mail,
    FileText,
    AlertTriangle,
} from 'lucide-react'

interface CertStats {
    totalPresentes: number
    certificadosGerados: number
    certificadosEnviados: number
    pendentes: number
}

export function AdminCertificates() {
    const [stats, setStats] = useState<CertStats>({
        totalPresentes: 0, certificadosGerados: 0, certificadosEnviados: 0, pendentes: 0,
    })
    const { eventName } = useSettings()
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [generated, setGenerated] = useState(false)
    const [sent, setSent] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadStats()
    }, [])

    async function loadStats() {
        try {
            const data = await fetchCertificadosStats()
            setStats(data)
            if (data.certificadosGerados > 0) setGenerated(true)
            if (data.certificadosEnviados > 0 && data.pendentes === 0) setSent(true)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleGenerate() {
        setIsGenerating(true)
        setMessage('')
        try {
            const result = await gerarCertificados()
            setMessage(result.message)
            setGenerated(true)
            await loadStats()
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : 'Erro ao gerar')
        } finally {
            setIsGenerating(false)
        }
    }

    async function handleSendAll() {
        setIsSending(true)
        setMessage('')
        try {
            const result = await enviarCertificados()
            setMessage(result.message)
            setSent(true)
            await loadStats()
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : 'Erro ao enviar')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Certificados</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gere e envie certificados para os participantes presentes</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
                    <Award className="size-4" />
                    Emissão Oficial
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 bg-primary/10 rounded-full p-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="flex flex-col gap-4 p-6 relative">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Users className="size-5" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-foreground">{stats.totalPresentes}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Elegíveis (Presentes)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent relative overflow-hidden group">
                    <CardContent className="flex flex-col gap-4 p-6 relative">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FileText className="size-5" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-foreground">{stats.certificadosGerados}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Certificados Gerados</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent relative overflow-hidden group">
                    <CardContent className="flex flex-col gap-4 p-6 relative">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <Mail className="size-5" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-foreground">{stats.certificadosEnviados}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Enviados por E-mail</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent relative overflow-hidden group">
                    <CardContent className="flex flex-col gap-4 p-6 relative">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-foreground">{stats.pendentes}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entregas Pendentes</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Message */}
            {message && (
                <div className="flex items-center gap-3 rounded-xl bg-background border border-primary/20 p-4 text-sm text-foreground shadow-sm animate-fade-in-up">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <CheckCircle2 className="size-5" />
                    </div>
                    {message}
                </div>
            )}

            {/* Actions */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Generate */}
                <Card className="border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader className="bg-muted/5 border-b border-border/40 pb-6">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Award className="size-6" />
                            </div>
                            Gerar Certificados
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground/80 mt-2">
                            Processamento em lote dos PDFs para todos os participantes confirmados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="rounded-xl border border-border/50 bg-background/50 p-5 space-y-3">
                            <p className="text-sm font-semibold text-foreground">Configurações do Documento:</p>
                            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary/60"></div>
                                    <span>{eventName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary/60"></div>
                                    <span>Carga Horária: 40h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary/60"></div>
                                    <span>Autenticação Digital</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary/60"></div>
                                    <span>Layout Oficial SEMED</span>
                                </div>
                            </div>
                        </div>

                        {generated && !isGenerating ? (
                            <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                                <CheckCircle2 className="size-5 shrink-0" />
                                <span className="font-medium">Certificados gerados e prontos para envio!</span>
                            </div>
                        ) : (
                            <Button
                                size="xl"
                                className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
                                onClick={handleGenerate}
                                disabled={isGenerating || stats.totalPresentes === 0}
                            >
                                {isGenerating ? (
                                    <>
                                        <Spinner />
                                        Gerando Documentos...
                                    </>
                                ) : (
                                    <>
                                        <Award className="size-5" />
                                        Gerar {stats.totalPresentes} Certificados PDF
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Send */}
                <Card className="border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader className="bg-muted/5 border-b border-border/40 pb-6">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Send className="size-6" />
                            </div>
                            Disparar E-mails
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground/80 mt-2">
                            Envio automático dos certificados em anexo para os e-mails cadastrados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="rounded-xl border border-border/50 bg-background/50 p-5 space-y-3">
                            <p className="text-sm font-semibold text-foreground">Resumo da Campanha:</p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex justify-between items-center border-b border-border/30 pb-2">
                                    <span>Template de E-mail</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">Oficial SEMED</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/30 pb-2">
                                    <span>Remetente</span>
                                    <span>noreply@semed.tuntum.ma.gov.br</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Anexo</span>
                                    <span>certificado_participacao.pdf</span>
                                </div>
                            </div>
                        </div>

                        {!generated ? (
                            <div className="flex items-center gap-3 rounded-xl bg-cyan-50 border border-cyan-100 p-4 text-sm text-cyan-800">
                                <AlertTriangle className="size-5 shrink-0" />
                                <span>Ação bloqueada: Gere os certificados primeiro.</span>
                            </div>
                        ) : sent && !isSending ? (
                            <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                                <CheckCircle2 className="size-5 shrink-0" />
                                <span className="font-medium">Envio concluído com sucesso!</span>
                            </div>
                        ) : (
                            <Button
                                size="xl"
                                className="w-full gap-2 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                onClick={handleSendAll}
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <Spinner />
                                        Enviando em lote...
                                    </>
                                ) : (
                                    <>
                                        <Send className="size-5" />
                                        Enviar para {stats.pendentes} Participantes
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info */}
            <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-4 shadow-sm">
                <div className="bg-background rounded-full p-1.5 shadow-sm">
                    <Award className="size-5 text-primary" />
                </div>
                <div className="text-sm leading-relaxed text-muted-foreground">
                    <strong className="text-foreground block mb-0.5">Política de Certificação</strong>
                    Os certificados são documentos oficiais da Secretaria Municipal de Educação.
                    Certifique-se de que todos os check-ins foram realizados corretamente antes de iniciar a geração em lote.
                </div>
            </div>
        </div>
    )
}
