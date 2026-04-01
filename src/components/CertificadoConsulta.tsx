import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { consultarCertificado, downloadCertificado, type ConsultaCertificado } from '@/lib/api'
import { formatCPF, validateCPF } from '@/lib/validators'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import {
    Award,
    Search,
    Download,
    CheckCircle2,
    XCircle,
    AlertCircle,
    User,
    Briefcase,
    Building2,
} from 'lucide-react'

export function CertificadoConsulta() {
    const [cpf, setCpf] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [result, setResult] = useState<ConsultaCertificado | null>(null)
    const [error, setError] = useState('')
    useScrollReveal()

    function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCpf(formatCPF(e.target.value))
        setResult(null)
        setError('')
    }

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setResult(null)

        if (!validateCPF(cpf)) {
            setError('CPF inv\u00E1lido. Verifique os d\u00EDgitos informados.')
            return
        }

        setIsSearching(true)
        try {
            const data = await consultarCertificado(cpf)
            setResult(data)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao consultar')
        } finally {
            setIsSearching(false)
        }
    }

    async function handleDownload() {
        setIsDownloading(true)
        setError('')
        try {
            await downloadCertificado(cpf)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao baixar certificado')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <section id="certificado" className="reveal py-20 px-6">
            <div className="mx-auto max-w-3xl">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-secondary p-10 md:p-14 shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl">
                                <Award className="size-8 text-accent" />
                            </div>
                        </div>

                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-2">
                            Consultar Certificado
                        </h2>
                        <p className="text-white/75 text-center max-w-md mx-auto mb-8 leading-relaxed">
                            Informe seu CPF para verificar sua participa\u00E7\u00E3o e baixar seu certificado.
                        </p>

                        {/* Search form */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    maxLength={14}
                                    className="h-12 bg-white/95 border-white/20 text-foreground placeholder:text-muted-foreground text-center text-lg font-mono tracking-wider rounded-xl shadow-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSearching || cpf.replace(/\D/g, '').length < 11}
                                className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-xl shadow-lg shadow-accent/30 font-bold"
                            >
                                {isSearching ? (
                                    <><Spinner /> Buscando...</>
                                ) : (
                                    <><Search className="size-4" /> Consultar</>
                                )}
                            </Button>
                        </form>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-200 text-sm mb-4 animate-fade-in-up">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className="animate-fade-in-up">
                                {result.status === 'not_found' && (
                                    <Card className="bg-white/10 backdrop-blur-sm border-white/15 max-w-lg mx-auto">
                                        <CardContent className="flex items-center gap-4 p-5">
                                            <div className="bg-red-500/20 p-2.5 rounded-xl shrink-0">
                                                <XCircle className="size-6 text-red-300" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">Inscri\u00E7\u00E3o n\u00E3o encontrada</p>
                                                <p className="text-white/65 text-xs mt-0.5">{result.message}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {result.status === 'no_presence' && (
                                    <Card className="bg-white/10 backdrop-blur-sm border-white/15 max-w-lg mx-auto">
                                        <CardContent className="flex items-center gap-4 p-5">
                                            <div className="bg-amber-500/20 p-2.5 rounded-xl shrink-0">
                                                <AlertCircle className="size-6 text-amber-300" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">
                                                    Presen\u00E7a n\u00E3o confirmada
                                                </p>
                                                <p className="text-white/65 text-xs mt-0.5">
                                                    Ol\u00E1, <strong className="text-white/85">{result.nome}</strong>. {result.message}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {result.status === 'eligible' && (
                                    <Card className="bg-white/10 backdrop-blur-sm border-white/15 max-w-lg mx-auto">
                                        <CardContent className="p-6 space-y-4">
                                            {/* Success header */}
                                            <div className="flex items-center gap-3">
                                                <div className="bg-emerald-500/20 p-2.5 rounded-xl shrink-0">
                                                    <CheckCircle2 className="size-6 text-emerald-300" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">Participa\u00E7\u00E3o confirmada!</p>
                                                    <p className="text-white/65 text-xs">Seu certificado est\u00E1 pronto para download.</p>
                                                </div>
                                            </div>

                                            {/* Participant info */}
                                            <div className="grid gap-2 bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center gap-2.5 text-sm text-white/80">
                                                    <User className="size-4 text-accent shrink-0" />
                                                    <span className="font-medium text-white">{result.nome}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-white/80">
                                                    <Briefcase className="size-4 text-accent shrink-0" />
                                                    <span>{result.cargo}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-white/80">
                                                    <Building2 className="size-4 text-accent shrink-0" />
                                                    <span>{result.instituicao}</span>
                                                </div>
                                            </div>

                                            {/* Download button */}
                                            <Button
                                                onClick={handleDownload}
                                                disabled={isDownloading}
                                                className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-xl shadow-lg shadow-accent/30 font-bold text-base"
                                            >
                                                {isDownloading ? (
                                                    <><Spinner /> Gerando PDF...</>
                                                ) : (
                                                    <><Download className="size-5" /> Baixar Certificado PDF</>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
