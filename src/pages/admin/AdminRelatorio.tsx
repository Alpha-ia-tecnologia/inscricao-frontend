import { useState, useEffect } from 'react'
import { fetchRelatorio } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { FileText, Printer, Users, UserCheck, UserX, Award, CalendarDays, Briefcase, Building2 } from 'lucide-react'

interface ReportData {
    totalInscritos: number
    presentes: number
    presentesDia1: number
    presentesDia2: number
    ausentes: number
    vagas: {
        dia1: { total: number; max: number }
        dia2: { total: number; max: number }
    }
    porInstituicao: Array<{ name: string; count: number }>
    porCargo: Array<{ name: string; count: number }>
    porDia: Array<{ name: string; count: number }>
    certificadosGerados: number
    certificadosEnviados: number
    participantes: Array<{
        nome: string
        cpf: string
        instituicao: string
        cargo: string
        dia_participacao: string
        presente_dia1: number
        presente_dia2: number
        data_inscricao: string
    }>
    geradoEm: string
}

function diaLabel(d: string) {
    return d === 'dia1' ? '1º Dia' : d === 'dia2' ? '2º Dia' : 'Ambos'
}

export function AdminRelatorio() {
    const [data, setData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(true)
    const { eventName } = useSettings()

    useEffect(() => {
        fetchRelatorio()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    function handlePrint() {
        if (!data) return

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Relatório Geral — ${eventName}</title>
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
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .bar-label { width: 180px; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track { flex: 1; height: 18px; background: #e8ecf6; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; background: #3B6FCB; border-radius: 4px; display: flex; align-items: center; padding-left: 6px; color: #fff; font-size: 10px; font-weight: 600; min-width: 24px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #cbd5e8; color: #94a3b8; font-size: 10px; text-align: center; }
  @media print {
    body { padding: 20px; }
    .kpi-grid { grid-template-columns: repeat(4, 1fr); }
  }
</style>
</head>
<body>
<h1>${eventName}</h1>
<p class="subtitle">Relatório Geral — Gerado em ${new Date(data.geradoEm).toLocaleString('pt-BR')}</p>

<h2>📊 Indicadores Gerais</h2>
<div class="kpi-grid">
  <div class="kpi"><div class="value">${data.totalInscritos}</div><div class="label">Total de Inscritos</div></div>
  <div class="kpi"><div class="value">${data.presentes}</div><div class="label">Check-ins Realizados</div></div>
  <div class="kpi"><div class="value">${data.ausentes}</div><div class="label">Ausentes</div></div>
  <div class="kpi"><div class="value">${data.certificadosEnviados}</div><div class="label">Certificados Entregues</div></div>
</div>

<div class="kpi-grid" style="grid-template-columns: repeat(2, 1fr);">
  <div class="kpi">
    <div class="value">${data.presentesDia1}</div>
    <div class="label">Presentes — 1º Dia (25/02)</div>
    <div style="margin-top:4px;font-size:11px;color:#64748b">${data.vagas.dia1.total} inscritos / ${data.vagas.dia1.max} vagas</div>
  </div>
  <div class="kpi">
    <div class="value">${data.presentesDia2}</div>
    <div class="label">Presentes — 2º Dia (26/02)</div>
    <div style="margin-top:4px;font-size:11px;color:#64748b">${data.vagas.dia2.total} inscritos / ${data.vagas.dia2.max} vagas</div>
  </div>
</div>

<div class="two-col">
<div>
  <h2>🏫 Por Instituição</h2>
  ${data.porInstituicao.map(i => {
            const pct = Math.round((i.count / (data.totalInscritos || 1)) * 100)
            return `<div class="bar-row"><span class="bar-label">${i.name}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct, 5)}%">${i.count}</div></div></div>`
        }).join('')}
</div>
<div>
  <h2>💼 Por Cargo/Função</h2>
  ${data.porCargo.map(c => {
            const pct = Math.round((c.count / (data.totalInscritos || 1)) * 100)
            return `<div class="bar-row"><span class="bar-label">${c.name}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct, 5)}%">${c.count}</div></div></div>`
        }).join('')}
</div>
</div>

<h2>📅 Distribuição por Dia</h2>
<table>
<thead><tr><th>Dia</th><th>Inscritos</th><th>% do Total</th></tr></thead>
<tbody>
${data.porDia.map(d => `<tr><td>${d.name}</td><td>${d.count}</td><td>${Math.round((d.count / (data.totalInscritos || 1)) * 100)}%</td></tr>`).join('')}
</tbody>
</table>

<h2>📋 Lista Completa de Participantes</h2>
<table>
<thead>
  <tr><th>#</th><th>Nome</th><th>CPF</th><th>Instituição</th><th>Cargo</th><th>Dia</th><th>Dia 1</th><th>Dia 2</th></tr>
</thead>
<tbody>
${data.participantes.map((p, i) => `<tr>
  <td>${i + 1}</td>
  <td>${p.nome}</td>
  <td>${p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</td>
  <td>${p.instituicao}</td>
  <td>${p.cargo}</td>
  <td>${diaLabel(p.dia_participacao)}</td>
  <td><span class="badge ${p.presente_dia1 ? 'badge-green' : 'badge-red'}">${p.presente_dia1 ? '✓' : '✗'}</span></td>
  <td><span class="badge ${p.presente_dia2 ? 'badge-green' : 'badge-red'}">${p.presente_dia2 ? '✓' : '✗'}</span></td>
</tr>`).join('')}
</tbody>
</table>

<div class="footer">
  ${eventName} — Relatório gerado automaticamente em ${new Date(data.geradoEm).toLocaleString('pt-BR')}
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
                Erro ao carregar relatório
            </div>
        )
    }

    const maxInst = data.porInstituicao.length > 0 ? data.porInstituicao[0].count : 1
    const maxCargo = data.porCargo.length > 0 ? data.porCargo[0].count : 1

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20">
                            <FileText className="size-5" />
                        </div>
                        Relatório Geral
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Visão completa de inscrições, presenças e dados do evento.
                    </p>
                </div>
                <Button onClick={handlePrint} className="gap-2">
                    <Printer className="size-4" />
                    Imprimir / PDF
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                                <Users className="size-4" />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">Total Inscritos</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{data.totalInscritos}</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card to-card">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                                <UserCheck className="size-4" />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">Check-ins</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{data.presentes}</p>
                        <p className="text-xs text-muted-foreground mt-1">{Math.round((data.presentes / (data.totalInscritos || 1)) * 100)}% do total</p>
                    </CardContent>
                </Card>

                <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-card to-card">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-rose-500 text-white">
                                <UserX className="size-4" />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">Ausentes</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{data.ausentes}</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
                                <Award className="size-4" />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">Certificados</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{data.certificadosEnviados}</p>
                        <p className="text-xs text-muted-foreground mt-1">{data.certificadosGerados} gerados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Per-day attendance */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-indigo-500/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarDays className="size-4 text-indigo-500" />
                            1º Dia — 25/02
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Inscritos</span>
                            <span className="font-semibold">{data.vagas.dia1.total} / {data.vagas.dia1.max}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Presentes</span>
                            <span className="font-semibold text-emerald-600">{data.presentesDia1}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${Math.min((data.presentesDia1 / (data.vagas.dia1.total || 1)) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">{Math.round((data.presentesDia1 / (data.vagas.dia1.total || 1)) * 100)}% de presença</p>
                    </CardContent>
                </Card>

                <Card className="border-violet-500/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarDays className="size-4 text-violet-500" />
                            2º Dia — 26/02
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Inscritos</span>
                            <span className="font-semibold">{data.vagas.dia2.total} / {data.vagas.dia2.max}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Presentes</span>
                            <span className="font-semibold text-emerald-600">{data.presentesDia2}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${Math.min((data.presentesDia2 / (data.vagas.dia2.total || 1)) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">{Math.round((data.presentesDia2 / (data.vagas.dia2.total || 1)) * 100)}% de presença</p>
                    </CardContent>
                </Card>
            </div>

            {/* Breakdowns */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Por Instituição */}
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building2 className="size-4 text-primary" />
                            Por Instituição
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.porInstituicao.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum dado</p>
                        ) : (
                            data.porInstituicao.map((inst, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-foreground font-medium truncate pr-4">{inst.name}</span>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{inst.count}</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${(inst.count / maxInst) * 100}%` }} />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Por Cargo */}
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Briefcase className="size-4 text-primary" />
                            Por Cargo/Função
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.porCargo.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum dado</p>
                        ) : (
                            data.porCargo.map((c, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-foreground font-medium truncate pr-4">{c.name}</span>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{c.count}</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60" style={{ width: `${(c.count / maxCargo) * 100}%` }} />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Participants table */}
            <Card className="border-border/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="size-4 text-primary" />
                        Lista de Participantes ({data.participantes.length})
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
                                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Dia</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Dia 1</th>
                                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Dia 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.participantes.map((p, i) => (
                                    <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                        <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                        <td className="px-3 py-2 font-medium text-foreground">{p.nome}</td>
                                        <td className="px-3 py-2 text-muted-foreground font-mono text-xs">
                                            {p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                        </td>
                                        <td className="px-3 py-2 text-muted-foreground">{p.instituicao}</td>
                                        <td className="px-3 py-2 text-muted-foreground">{p.cargo}</td>
                                        <td className="px-3 py-2">
                                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                {diaLabel(p.dia_participacao)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.presente_dia1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.presente_dia1 ? '✓' : '✗'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.presente_dia2 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.presente_dia2 ? '✓' : '✗'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <p className="text-xs text-muted-foreground text-center">
                Relatório gerado em {new Date(data.geradoEm).toLocaleString('pt-BR')}
            </p>
        </div>
    )
}
