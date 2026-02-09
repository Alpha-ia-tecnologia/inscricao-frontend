import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { fetchStats } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import {
    Users,
    UserCheck,
    UserX,
    Award,
    TrendingUp,
} from 'lucide-react'

interface StatsData {
    totalInscritos: number
    presentes: number
    ausentes: number
    certificadosEnviados: number
    porInstituicao: Array<{ name: string; count: number }>
    recentes: Array<{ nome: string; instituicao: string; cargo: string; data_inscricao: string }>
}

export function AdminDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)
    const { eventName } = useSettings()

    useEffect(() => {
        fetchStats()
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
                Erro ao carregar dados do dashboard
            </div>
        )
    }

    const maxInst = stats.porInstituicao.length > 0 ? stats.porInstituicao[0].count : 1

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="mt-1 text-muted-foreground">Visão geral em tempo real da {eventName}.</p>
                </div>
                <div className="text-sm font-medium text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/50">
                    Última atualização: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="size-16 text-primary" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mb-4">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.totalInscritos}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Total de Inscritos</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCheck className="size-16 text-emerald-500" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 mb-4">
                            <UserCheck className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.presentes}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm font-medium text-muted-foreground">Check-ins Realizados</p>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                    {Math.round((stats.presentes / (stats.totalInscritos || 1)) * 100)}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserX className="size-16 text-rose-500" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/25 mb-4">
                            <UserX className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.ausentes}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Ausências</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card to-card shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award className="size-16 text-blue-500" />
                    </div>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/25 mb-4">
                            <Award className="size-6" />
                        </div>
                        <div>
                            <p className="text-4xl font-display font-bold text-foreground tracking-tight">{stats.certificadosEnviados}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Certificados Entregues</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent */}
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-primary" />
                                <h3 className="font-display font-bold text-lg text-foreground">Inscrições Recentes</h3>
                            </div>
                        </div>
                        {stats.recentes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                                <Users className="size-10 mb-2" />
                                <p className="text-sm">Nenhuma inscrição recente</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentes.map((r, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors border border-transparent hover:border-border/50">
                                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/10">
                                            {r.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{r.nome}</p>
                                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                <span className="font-medium text-primary/80">{r.cargo}</span> • {r.instituicao}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="inline-block px-2 py-1 rounded bg-background border border-border/50 text-xs font-medium text-muted-foreground shadow-sm">
                                                {new Date().toLocaleDateString() === r.data_inscricao.split(' ')[0] ? 'Hoje' : r.data_inscricao}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* By institution */}
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="size-5 text-primary" />
                            <h3 className="font-display font-bold text-lg text-foreground">Por Instituição</h3>
                        </div>
                        {stats.porInstituicao.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum dado ainda</p>
                        ) : (
                            <div className="space-y-5">
                                {stats.porInstituicao.map((inst, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-foreground font-medium truncate pr-4">{inst.name}</span>
                                            <span className="font-bold text-foreground bg-primary/10 px-2 py-0.5 rounded text-xs text-primary">{inst.count}</span>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                                                style={{ width: `${(inst.count / maxInst) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
