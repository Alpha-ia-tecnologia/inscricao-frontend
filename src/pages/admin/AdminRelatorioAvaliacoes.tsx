import { useState, useEffect } from 'react'
import { fetchAvaliacoesRelatorio, getAvaliacoesExportUrl } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
    Star,
    Printer,
    Download,
    Users,
    TrendingUp,
    MessageSquare,
    BarChart3,
    ClipboardList,
    Lightbulb,
} from 'lucide-react'

interface AvaliacaoItem {
    nome: string
    cpf: string
    instituicao: string
    cargo: string
    nota_geral: number
    nota_conteudo: number
    nota_organizacao: number
    nota_palestrantes: number
    media_individual: number
    comentario: string | null
    sugestoes: string | null
    created_at: string
}

interface RelatorioData {
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
    distribuicaoPorCategoria: {
        geral: Array<{ nota: number; count: number }>
        conteudo: Array<{ nota: number; count: number }>
        organizacao: Array<{ nota: number; count: number }>
        palestrantes: Array<{ nota: number; count: number }>
    }
    avaliacoes: AvaliacaoItem[]
    comentarios: Array<{ comentario: string; sugestoes: string | null; created_at: string; nome: string }>
    geradoEm: string
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
            <span className={`ml-2 font-bold text-foreground ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'}`}>
                {value.toFixed(1)}
            </span>
        </div>
    )
}

function DistributionBars({ data, maxCount }: { data: Array<{ nota: number; count: number }>; maxCount: number }) {
    return (
        <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((nota) => {
                const entry = data.find((d) => Number(d.nota) === nota)
                const count = entry?.count || 0
                return (
                    <div key={nota} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16 shrink-0">
                            <span className="text-sm font-bold text-foreground w-4">{nota}</span>
                            <Star className="size-3.5 fill-accent text-accent" />
                        </div>
                        <div className="flex-1 h-2.5 rounded-full bg-muted/50 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                                style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%' }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-foreground w-8 text-right">{count}</span>
                    </div>
                )
            })}
        </div>
    )
}

export function AdminRelatorioAvaliacoes() {
    const [data, setData] = useState<RelatorioData | null>(null)
    const [loading, setLoading] = useState(true)
    const { eventName } = useSettings()

    useEffect(() => {
        fetchAvaliacoesRelatorio()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

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

    function handlePrint() {
        if (!data) return

        const starsHtml = (val: number) => {
            return [1, 2, 3, 4, 5].map(s =>
                `<span style="color:${s <= Math.round(val) ? '#f59e0b' : '#d1d5db'}; font-size:14px;">★</span>`
            ).join('') + ` <strong>${val.toFixed(1)}</strong>`
        }

        const catDistHtml = (label: string, dist: Array<{ nota: number; count: number }>, maxC: number) => {
            const bars = [5, 4, 3, 2, 1].map(n => {
                const c = dist.find(d => Number(d.nota) === n)?.count || 0
                const pct = maxC > 0 ? Math.round((c / maxC) * 100) : 0
                return `<div class="bar-row"><span class="bar-n">${n}★</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct, 3)}%">${c}</div></div></div>`
            }).join('')
            return `<h3>${label}</h3>${bars}`
        }

        const allDists = [
            ...data.distribuicaoPorCategoria.geral,
            ...data.distribuicaoPorCategoria.conteudo,
            ...data.distribuicaoPorCategoria.organizacao,
            ...data.distribuicaoPorCategoria.palestrantes,
        ]
        const maxDist = allDists.length > 0 ? Math.max(...allDists.map(d => d.count)) : 1

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Relatório de Avaliação — ${eventName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a2340; background: #fff; padding: 40px; font-size: 12px; }
  h1 { font-size: 22px; color: #1E3A6E; margin-bottom: 4px; }
  h2 { font-size: 16px; color: #3B6FCB; margin: 28px 0 12px; border-bottom: 2px solid #3B6FCB; padding-bottom: 6px; }
  h3 { font-size: 13px; color: #1E3A6E; margin: 16px 0 8px; }
  .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .kpi { border: 1px solid #cbd5e8; border-radius: 8px; padding: 14px; text-align: center; }
  .kpi .value { font-size: 28px; font-weight: 700; color: #1E3A6E; }
  .kpi .label { font-size: 11px; color: #64748b; margin-top: 4px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
  th { background: #1E3A6E; color: #fff; padding: 8px 10px; text-align: left; font-weight: 600; }
  td { padding: 6px 10px; border-bottom: 1px solid #e8ecf6; }
  tr:nth-child(even) td { background: #f8f9fc; }
  .bar-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
  .bar-n { width: 30px; font-size: 11px; font-weight: 600; text-align: right; }
  .bar-track { flex: 1; height: 16px; background: #e8ecf6; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; background: #3B6FCB; border-radius: 4px; display: flex; align-items: center; padding-left: 6px; color: #fff; font-size: 10px; font-weight: 600; min-width: 20px; }
  .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; }
  .comment-box { background: #f8f9fc; border-radius: 8px; padding: 12px; margin-bottom: 8px; border: 1px solid #e8ecf6; }
  .comment-name { font-weight: 600; font-size: 12px; color: #1E3A6E; }
  .comment-text { font-size: 11px; color: #334155; margin-top: 4px; }
  .comment-sug { font-size: 11px; color: #7c3aed; margin-top: 4px; font-style: italic; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
  .badge-high { background: #dcfce7; color: #166534; }
  .badge-mid { background: #fef3c7; color: #92400e; }
  .badge-low { background: #fee2e2; color: #991b1b; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #cbd5e8; color: #94a3b8; font-size: 10px; text-align: center; }
  @media print {
    body { padding: 20px; }
    .kpi-grid { grid-template-columns: repeat(4, 1fr); }
  }
</style>
</head>
<body>
<h1>📊 Relatório de Avaliação Detalhado</h1>
<p class="subtitle">${eventName} — Gerado em ${new Date(data.geradoEm).toLocaleString('pt-BR')}</p>

<h2>📈 Indicadores Gerais</h2>
<div class="kpi-grid">
  <div class="kpi"><div class="value">${data.mediaGeral.toFixed(1)}</div><div class="label">Média Geral</div></div>
  <div class="kpi"><div class="value">${data.totalAvaliacoes}</div><div class="label">Avaliações Recebidas</div></div>
  <div class="kpi"><div class="value">${data.taxaResposta}%</div><div class="label">Taxa de Resposta</div></div>
  <div class="kpi"><div class="value">${data.totalInscritos}</div><div class="label">Total de Inscritos</div></div>
</div>

<h2>⭐ Notas por Categoria</h2>
<table>
<thead><tr><th>Categoria</th><th>Média</th><th style="width:40%">Visual</th></tr></thead>
<tbody>
  <tr><td>Experiência Geral</td><td>${starsHtml(data.medias.geral)}</td><td><div class="bar-track"><div class="bar-fill" style="width:${(data.medias.geral / 5) * 100}%">${data.medias.geral.toFixed(1)}</div></div></td></tr>
  <tr><td>Conteúdo</td><td>${starsHtml(data.medias.conteudo)}</td><td><div class="bar-track"><div class="bar-fill" style="width:${(data.medias.conteudo / 5) * 100}%">${data.medias.conteudo.toFixed(1)}</div></div></td></tr>
  <tr><td>Organização</td><td>${starsHtml(data.medias.organizacao)}</td><td><div class="bar-track"><div class="bar-fill" style="width:${(data.medias.organizacao / 5) * 100}%">${data.medias.organizacao.toFixed(1)}</div></div></td></tr>
  <tr><td>Palestrantes</td><td>${starsHtml(data.medias.palestrantes)}</td><td><div class="bar-track"><div class="bar-fill" style="width:${(data.medias.palestrantes / 5) * 100}%">${data.medias.palestrantes.toFixed(1)}</div></div></td></tr>
</tbody>
</table>

<h2>📊 Distribuição de Notas por Categoria</h2>
<div class="cat-grid">
  ${catDistHtml('⭐ Experiência Geral', data.distribuicaoPorCategoria.geral, maxDist)}
  ${catDistHtml('📚 Conteúdo', data.distribuicaoPorCategoria.conteudo, maxDist)}
  ${catDistHtml('📋 Organização', data.distribuicaoPorCategoria.organizacao, maxDist)}
  ${catDistHtml('🎤 Palestrantes', data.distribuicaoPorCategoria.palestrantes, maxDist)}
</div>

<h2>📋 Avaliações Individuais</h2>
<table>
<thead>
  <tr><th>#</th><th>Nome</th><th>CPF</th><th>Instituição</th><th>Geral</th><th>Conteúdo</th><th>Org.</th><th>Palestr.</th><th>Média</th></tr>
</thead>
<tbody>
${data.avaliacoes.map((a, i) => {
            const media = Number(a.media_individual)
            const badgeClass = media >= 4 ? 'badge-high' : media >= 3 ? 'badge-mid' : 'badge-low'
            return `<tr>
  <td>${i + 1}</td>
  <td>${a.nome}</td>
  <td>${a.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</td>
  <td>${a.instituicao}</td>
  <td>${a.nota_geral}</td>
  <td>${a.nota_conteudo}</td>
  <td>${a.nota_organizacao}</td>
  <td>${a.nota_palestrantes}</td>
  <td><span class="badge ${badgeClass}">${media.toFixed(1)}</span></td>
</tr>`
        }).join('')}
</tbody>
</table>

${data.comentarios.length > 0 ? `
<h2>💬 Comentários e Sugestões</h2>
${data.comentarios.map(c => `
<div class="comment-box">
  <div class="comment-name">${c.nome}</div>
  ${c.comentario ? `<div class="comment-text">💬 ${c.comentario}</div>` : ''}
  ${c.sugestoes ? `<div class="comment-sug">💡 ${c.sugestoes}</div>` : ''}
</div>
`).join('')}
` : ''}

<div class="footer">
  ${eventName} — Relatório de Avaliação gerado automaticamente em ${new Date(data.geradoEm).toLocaleString('pt-BR')}
</div>
</body>
</html>`

        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(html)
            printWindow.document.close()
            setTimeout(() => printWindow.print(), 500)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <Spinner />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Erro ao carregar relatório de avaliações
            </div>
        )
    }

    const allDistCounts = [
        ...data.distribuicaoPorCategoria.geral,
        ...data.distribuicaoPorCategoria.conteudo,
        ...data.distribuicaoPorCategoria.organizacao,
        ...data.distribuicaoPorCategoria.palestrantes,
    ]
    const maxDistCount = allDistCounts.length > 0 ? Math.max(...allDistCounts.map(d => d.count)) : 1

    const categories = [
        { label: 'Experiência Geral', emoji: '⭐', value: data.medias.geral, dist: data.distribuicaoPorCategoria.geral },
        { label: 'Conteúdo', emoji: '📚', value: data.medias.conteudo, dist: data.distribuicaoPorCategoria.conteudo },
        { label: 'Organização', emoji: '📋', value: data.medias.organizacao, dist: data.distribuicaoPorCategoria.organizacao },
        { label: 'Palestrantes', emoji: '🎤', value: data.medias.palestrantes, dist: data.distribuicaoPorCategoria.palestrantes },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-accent/20">
                            <ClipboardList className="size-5" />
                        </div>
                        Relatório de Avaliação
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Análise detalhada das avaliações do evento pelos participantes.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExportCSV} className="gap-2">
                        <Download className="size-4" />
                        Exportar CSV
                    </Button>
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="size-4" />
                        Imprimir / PDF
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Média Geral */}
                <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="size-16 text-accent" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/25 mb-4">
                            <Star className="size-6" />
                        </div>
                        <div>
                            <StarDisplay value={data.mediaGeral} size="lg" />
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
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{data.totalAvaliacoes}</p>
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
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{data.taxaResposta}%</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm font-medium text-muted-foreground">Taxa de Resposta</p>
                                <span className="text-xs text-muted-foreground">({data.totalAvaliacoes}/{data.totalInscritos})</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Inscritos */}
                <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="size-16 text-emerald-500" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 mb-4">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{data.totalInscritos}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Total de Inscritos</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Ratings */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="size-5 text-accent" />
                        Notas por Categoria
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {categories.map((cat) => (
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
                </CardContent>
            </Card>

            {/* Distribution by Category */}
            <div className="grid gap-6 lg:grid-cols-2">
                {categories.map((cat) => (
                    <Card key={cat.label} className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <BarChart3 className="size-4 text-primary" />
                                {cat.emoji} {cat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cat.dist.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                                    <BarChart3 className="size-8 mb-2" />
                                    <p className="text-sm">Nenhuma avaliação ainda</p>
                                </div>
                            ) : (
                                <DistributionBars data={cat.dist} maxCount={maxDistCount} />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Individual Assessments Table */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList className="size-5 text-primary" />
                        Avaliações Individuais ({data.avaliacoes.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-border/50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border/50">
                                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">#</th>
                                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Nome</th>
                                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">CPF</th>
                                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Instituição</th>
                                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Cargo</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Geral</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Conteúdo</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Org.</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Palestr.</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Média</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.avaliacoes.map((a, i) => {
                                    const media = Number(a.media_individual)
                                    const badgeColor = media >= 4
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : media >= 3
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                    return (
                                        <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                            <td className="px-3 py-2 font-medium text-foreground">{a.nome}</td>
                                            <td className="px-3 py-2 text-muted-foreground font-mono text-xs">
                                                {a.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                            </td>
                                            <td className="px-3 py-2 text-muted-foreground">{a.instituicao}</td>
                                            <td className="px-3 py-2 text-muted-foreground">{a.cargo}</td>
                                            <td className="px-3 py-2 text-center font-semibold">{a.nota_geral}</td>
                                            <td className="px-3 py-2 text-center font-semibold">{a.nota_conteudo}</td>
                                            <td className="px-3 py-2 text-center font-semibold">{a.nota_organizacao}</td>
                                            <td className="px-3 py-2 text-center font-semibold">{a.nota_palestrantes}</td>
                                            <td className="px-3 py-2 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
                                                    {media.toFixed(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Comments & Suggestions */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="size-5 text-primary" />
                        Comentários e Sugestões
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                            {data.comentarios.length} registro(s)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {data.comentarios.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                            <MessageSquare className="size-10 mb-2" />
                            <p className="text-sm">Nenhum comentário ou sugestão registrado</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {data.comentarios.map((c, i) => (
                                <div key={i} className="p-4 rounded-xl bg-muted/40 border border-transparent hover:border-border/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 border border-primary/10">
                                            {c.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{c.nome}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(c.created_at).toLocaleString('pt-BR')}
                                            </p>
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

            {/* Footer */}
            <p className="text-xs text-muted-foreground text-center">
                Relatório de Avaliação gerado em {new Date(data.geradoEm).toLocaleString('pt-BR')}
            </p>
        </div>
    )
}
