import { useState } from 'react'
import { submitAvaliacao } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import { Star, CheckCircle, ArrowRight, ArrowLeft, Leaf, MessageSquare, Lightbulb } from 'lucide-react'

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    const [hover, setHover] = useState(0)

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{label}</label>
            <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 transition-all duration-200 hover:scale-125 cursor-pointer focus:outline-none"
                    >
                        <Star
                            className={`size-8 transition-all duration-200 ${star <= (hover || value)
                                    ? 'fill-accent text-accent drop-shadow-[0_0_6px_rgba(212,168,83,0.5)]'
                                    : 'text-border hover:text-accent/40'
                                }`}
                        />
                    </button>
                ))}
            </div>
            <div className="text-xs text-muted-foreground h-4">
                {(hover || value) > 0 && (
                    <span className="animate-fade-in">
                        {['', 'Ruim', 'Regular', 'Bom', 'Muito Bom', 'Excelente'][hover || value]}
                    </span>
                )}
            </div>
        </div>
    )
}

export function AvaliacaoPage() {
    const { eventName } = useSettings()
    const [step, setStep] = useState<'cpf' | 'avaliar' | 'sucesso'>('cpf')
    const [cpf, setCpf] = useState('')
    const [notas, setNotas] = useState({ geral: 0, conteudo: 0, organizacao: 0, palestrantes: 0 })
    const [comentario, setComentario] = useState('')
    const [sugestoes, setSugestoes] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function formatCpf(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
        if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    }

    function handleCpfNext() {
        const cleanCpf = cpf.replace(/\D/g, '')
        if (cleanCpf.length !== 11) {
            setError('Por favor, informe um CPF válido com 11 dígitos.')
            return
        }
        setError('')
        setStep('avaliar')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (notas.geral === 0 || notas.conteudo === 0 || notas.organizacao === 0 || notas.palestrantes === 0) {
            setError('Por favor, avalie todas as categorias.')
            return
        }

        setLoading(true)
        try {
            await submitAvaliacao({
                cpf,
                nota_geral: notas.geral,
                nota_conteudo: notas.conteudo,
                nota_organizacao: notas.organizacao,
                nota_palestrantes: notas.palestrantes,
                comentario: comentario || undefined,
                sugestoes: sugestoes || undefined,
            })
            setStep('sucesso')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar avaliação')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
            {/* Header */}
            <header className="w-full py-6 px-6">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20">
                        <Leaf className="size-5" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-lg text-foreground">{eventName}</h2>
                        <p className="text-xs text-muted-foreground tracking-wide">Avaliação do Evento</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-2xl">

                    {/* Step: CPF */}
                    {step === 'cpf' && (
                        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 md:p-12 animate-scale-in">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4">
                                    <Star className="size-8" />
                                </div>
                                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                                    Avalie o Evento
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                    Sua opinião é muito importante para melhorarmos cada vez mais. Informe seu CPF para iniciar.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-foreground block mb-2">
                                        CPF do Participante
                                    </label>
                                    <input
                                        type="text"
                                        value={formatCpf(cpf)}
                                        onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000.000.000-00"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-foreground text-lg tracking-wider placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        maxLength={14}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCpfNext()}
                                    />
                                </div>

                                {error && (
                                    <p className="text-destructive text-sm font-medium bg-destructive/10 px-4 py-2 rounded-lg">
                                        {error}
                                    </p>
                                )}

                                <button
                                    onClick={handleCpfNext}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-6 py-3.5 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                                >
                                    Continuar <ArrowRight className="size-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step: Avaliar */}
                    {step === 'avaliar' && (
                        <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 md:p-12 animate-scale-in">
                            <div className="text-center mb-8">
                                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                                    Como foi sua experiência?
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Avalie cada item clicando nas estrelas
                                </p>
                            </div>

                            {/* Star ratings */}
                            <div className="grid gap-6 sm:grid-cols-2 mb-8">
                                <div className="bg-muted/30 rounded-2xl p-5 border border-border/30">
                                    <StarRating
                                        label="⭐ Experiência Geral"
                                        value={notas.geral}
                                        onChange={(v) => setNotas({ ...notas, geral: v })}
                                    />
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-5 border border-border/30">
                                    <StarRating
                                        label="📚 Conteúdo"
                                        value={notas.conteudo}
                                        onChange={(v) => setNotas({ ...notas, conteudo: v })}
                                    />
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-5 border border-border/30">
                                    <StarRating
                                        label="📋 Organização"
                                        value={notas.organizacao}
                                        onChange={(v) => setNotas({ ...notas, organizacao: v })}
                                    />
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-5 border border-border/30">
                                    <StarRating
                                        label="🎤 Palestrantes"
                                        value={notas.palestrantes}
                                        onChange={(v) => setNotas({ ...notas, palestrantes: v })}
                                    />
                                </div>
                            </div>

                            {/* Text feedback */}
                            <div className="space-y-5 mb-8">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                        <MessageSquare className="size-4 text-primary" />
                                        Comentários <span className="text-muted-foreground font-normal">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="O que achou do evento? Conte-nos sua experiência..."
                                        rows={3}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                        <Lightbulb className="size-4 text-accent" />
                                        Sugestões <span className="text-muted-foreground font-normal">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={sugestoes}
                                        onChange={(e) => setSugestoes(e.target.value)}
                                        placeholder="Tem alguma sugestão para os próximos eventos?"
                                        rows={3}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-destructive text-sm font-medium bg-destructive/10 px-4 py-2 rounded-lg mb-4">
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setStep('cpf'); setError('') }}
                                    className="flex items-center gap-2 rounded-xl border border-border bg-background text-muted-foreground px-5 py-3.5 font-medium hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                                >
                                    <ArrowLeft className="size-4" /> Voltar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-6 py-3.5 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Enviar Avaliação <Star className="size-5" /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step: Sucesso */}
                    {step === 'sucesso' && (
                        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 md:p-12 text-center animate-scale-in">
                            <div className="inline-flex items-center justify-center size-20 rounded-full bg-success/10 text-success mb-6">
                                <CheckCircle className="size-10" />
                            </div>
                            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                                Obrigado pela sua Avaliação!
                            </h1>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                Seu feedback é muito valioso e nos ajudará a melhorar os próximos eventos. Agradecemos sua participação!
                            </p>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="/"
                                    className="flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-3 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Leaf className="size-5" />
                                    Voltar ao Início
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
