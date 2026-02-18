import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { fetchAvaliacoesStats, getAvaliacoesExportUrl } from '@/lib/api'
import {
    Star,
    MessageSquare,
    Users,
    TrendingUp,
    Download,
    Lightbulb,
    BarChart3,
} from 'lucide-react'

interface AvaliacaoStats {
    totalAvaliacoes: number
    totalInscritos: number
    taxaResposta: number
    mediaGeral: number
    medias: {
        geral: number
        conteudo: number
        organizacao: number
        palestrantes: number
    }
    distribuicao: Array<{ nota: number; count: number }>
    comentarios: Array<{ comentario: string; sugestoes: string | null; created_at: string; nome: string }>
}

function StarDisplay({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = size === 'lg' ? 'size-6' : size === 'md' ? 'size-5' : 'size-4'
    return (
        <div className="flex gap-0.5 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sizeClass} ${star <= Math.round(value)
                        ? 'fill-accent text-accent'
                        : 'text-border'
                        }`}
                />
            ))}
            <span className={`ml-2 font-bold text-foreground ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
                {value.toFixed(1)}
            </span>
        </div>
    )
}

export function AdminAvaliacoes() {
    const [stats, setStats] = useState<AvaliacaoStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAvaliacoesStats()
            .then(setStats)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <Spinner />
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Erro ao carregar dados das avaliações
            </div>
        )
    }

    const maxDist = stats.distribuicao.length > 0 ? Math.max(...stats.distribuicao.map((d) => d.count)) : 1

    function handleExportCSV() {
        const url = getAvaliacoesExportUrl()
        const token = localStorage.getItem('admin_token')
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.blob())
            .then((blob) => {
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = 'avaliacoes_evento.csv'
                a.click()
                URL.revokeObjectURL(a.href)
            })
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground">Avaliações</h1>
                    <p className="mt-1 text-muted-foreground">Resultados da avaliação do evento pelos participantes.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                    <Download className="size-4" /> Exportar CSV
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {/* Media Geral */}
                <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="size-16 text-accent" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/25 mb-4">
                            <Star className="size-6" />
                        </div>
                        <div>
                            <StarDisplay value={stats.mediaGeral} size="lg" />
                            <p className="text-sm font-medium text-muted-foreground mt-1">Média Geral</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Avaliações */}
                <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="size-16 text-primary" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mb-4">
                            <MessageSquare className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.totalAvaliacoes}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Avaliações Recebidas</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Taxa de Resposta */}
                <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="size-16 text-blue-500" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/25 mb-4">
                            <TrendingUp className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.taxaResposta}%</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm font-medium text-muted-foreground">Taxa de Resposta</p>
                                <span className="text-xs text-muted-foreground">({stats.totalAvaliacoes}/{stats.totalInscritos})</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Inscritos */}
                <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="size-16 text-blue-500" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/25 mb-4">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.totalInscritos}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Total de Inscritos</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Ratings + Distribution */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Category Ratings */}
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="size-5 text-accent" />
                            <h3 className="font-display font-bold text-lg text-foreground">Notas por Categoria</h3>
                        </div>
                        <div className="space-y-5">
                            {[
                                { label: 'Experiência Geral', emoji: '⭐', value: stats.medias.geral },
                                { label: 'Conteúdo', emoji: '📚', value: stats.medias.conteudo },
                                { label: 'Organização', emoji: '📋', value: stats.medias.organizacao },
                                { label: 'Palestrantes', emoji: '🎤', value: stats.medias.palestrantes },
                            ].map((cat) => (
                                <div key={cat.label} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <span>{cat.emoji}</span> {cat.label}
                                        </span>
                                        <StarDisplay value={cat.value} size="sm" />
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-500"
                                            style={{ width: `${(cat.value / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution */}
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="size-5 text-primary" />
                            <h3 className="font-display font-bold text-lg text-foreground">Distribuição de Notas</h3>
                        </div>
                        {stats.distribuicao.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                                <BarChart3 className="size-10 mb-2" />
                                <p className="text-sm">Nenhuma avaliação ainda</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[5, 4, 3, 2, 1].map((nota) => {
                                    const entry = stats!.distribuicao.find((d) => d.nota === nota)
                                    const count = entry?.count || 0
                                    return (
                                        <div key={nota} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 w-20 shrink-0">
                                                <span className="text-sm font-bold text-foreground w-4">{nota}</span>
                                                <Star className="size-4 fill-accent text-accent" />
                                            </div>
                                            <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                                                    style={{ width: maxDist > 0 ? `${(count / maxDist) * 100}%` : '0%' }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Comments */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="size-5 text-primary" />
                        <h3 className="font-display font-bold text-lg text-foreground">
                            Comentários e Sugestões
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                            {stats.comentarios.length} comentário(s)
                        </span>
                    </div>
                    {stats.comentarios.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                            <MessageSquare className="size-10 mb-2" />
                            <p className="text-sm">Nenhum comentário ainda</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {stats.comentarios.map((c, i) => (
                                <div key={i} className="p-4 rounded-xl bg-muted/40 border border-transparent hover:border-border/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 border border-primary/10">
                                            {c.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{c.nome}</p>
                                            <p className="text-xs text-muted-foreground">{c.created_at}</p>
                                        </div>
                                    </div>
                                    {c.comentario && (
                                        <div className="flex items-start gap-2 mt-2">
                                            <MessageSquare className="size-3.5 text-primary mt-0.5 shrink-0" />
                                            <p className="text-sm text-foreground/80">{c.comentario}</p>
                                        </div>
                                    )}
                                    {c.sugestoes && (
                                        <div className="flex items-start gap-2 mt-2">
                                            <Lightbulb className="size-3.5 text-accent mt-0.5 shrink-0" />
                                            <p className="text-sm text-foreground/80 italic">{c.sugestoes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
