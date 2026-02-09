import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import {
    Search,
    UserCheck,
    UserX,
    Download,
    Users,
    CheckCircle2,
    XCircle,
    Filter,
    Mail,
    Trash2,
} from 'lucide-react'
import { fetchInscricoes, togglePresenca, deleteInscricao, getExportCSVUrl } from '@/lib/api'

interface Participant {
    id: number
    nome: string
    cpf: string
    email: string
    telefone: string
    instituicao: string
    cargo: string
    presente: number
    data_inscricao: string
}

type TabFilter = 'todos' | 'presentes' | 'ausentes'

export function AdminParticipants() {
    const [participants, setParticipants] = useState<Participant[]>([])
    const [search, setSearch] = useState('')
    const [tab, setTab] = useState<TabFilter>('todos')
    const [loading, setLoading] = useState(true)
    const [togglingId, setTogglingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        fetchInscricoes()
            .then(setParticipants)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    // Filter logic
    const filtered = useMemo(() => {
        let result = participants

        if (tab === 'presentes') result = result.filter((p) => p.presente)
        if (tab === 'ausentes') result = result.filter((p) => !p.presente)

        if (search.trim()) {
            const term = search.toLowerCase()
            result = result.filter(
                (p) =>
                    p.nome.toLowerCase().includes(term) ||
                    p.cpf.includes(term) ||
                    p.email.toLowerCase().includes(term) ||
                    p.instituicao.toLowerCase().includes(term)
            )
        }

        return result
    }, [participants, search, tab])

    const totalPresentes = participants.filter((p) => p.presente).length
    const totalAusentes = participants.filter((p) => !p.presente).length

    async function handleToggle(id: number) {
        setTogglingId(id)
        try {
            const result = await togglePresenca(id)
            setParticipants((prev) =>
                prev.map((p) => (p.id === id ? { ...p, presente: result.presente ? 1 : 0 } : p))
            )
        } catch (err) {
            console.error(err)
        } finally {
            setTogglingId(null)
        }
    }

    function handleExport() {
        const token = localStorage.getItem('admin_token')
        // Open in new tab with auth header via fetch + download
        fetch(getExportCSVUrl(), {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'participantes_jornada_2026.csv'
                a.click()
                URL.revokeObjectURL(url)
            })
    }

    async function handleDelete(id: number, nome: string) {
        if (!confirm(`Tem certeza que deseja excluir a inscrição de "${nome}"? Esta ação não pode ser desfeita.`)) return
        setDeletingId(id)
        try {
            await deleteInscricao(id)
            setParticipants((prev) => prev.filter((p) => p.id !== id))
        } catch (err) {
            console.error(err)
            alert('Erro ao excluir inscrição')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Participantes</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gerencie inscrições e realize o check-in do evento</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all">
                    <Download className="size-4 text-primary" />
                    Exportar CSV
                </Button>
            </div>

            {/* Quick stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
                    <CardContent className="flex items-center gap-4 py-5">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary box-shadow-sm">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{participants.length}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Inscritos</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-50 to-transparent">
                    <CardContent className="flex items-center gap-4 py-5">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 box-shadow-sm">
                            <UserCheck className="size-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{totalPresentes}</p>
                            <p className="text-xs font-medium text-emerald-600/80 uppercase tracking-wide">Presentes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-rose-500/10 bg-gradient-to-br from-rose-50 to-transparent">
                    <CardContent className="flex items-center gap-4 py-5">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 box-shadow-sm">
                            <UserX className="size-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{totalAusentes}</p>
                            <p className="text-xs font-medium text-rose-600/80 uppercase tracking-wide">Ausentes</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/10 border-b border-border/40 pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <TabsList className="bg-muted/50 border border-border/20">
                            <TabsTrigger value="todos" active={tab === 'todos'} onClick={() => setTab('todos')} className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Filter className="size-3.5" />
                                Todos
                            </TabsTrigger>
                            <TabsTrigger value="presentes" active={tab === 'presentes'} onClick={() => setTab('presentes')} className="data-[state=active]:text-emerald-600 data-[state=active]:bg-emerald-50/50">
                                <CheckCircle2 className="size-3.5" />
                                Presentes
                            </TabsTrigger>
                            <TabsTrigger value="ausentes" active={tab === 'ausentes'} onClick={() => setTab('ausentes')} className="data-[state=active]:text-rose-600 data-[state=active]:bg-rose-50/50">
                                <XCircle className="size-3.5" />
                                Ausentes
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Nome, CPF ou E-mail..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background border-border/60 hover:border-primary/30 transition-colors focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-muted/30 p-6 rounded-full mb-4">
                                <Users className="size-10 text-muted-foreground/30" />
                            </div>
                            <p className="text-lg font-medium text-muted-foreground">Nenhum participante encontrado</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">Tente limpar os filtros ou buscar por outro termo</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSearch(''); setTab('todos') }}
                                className="mt-6"
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/5">
                                    <TableRow className="hover:bg-transparent border-b border-border/40">
                                        <TableHead className="font-semibold text-muted-foreground/80 pl-6 h-12">Participante</TableHead>
                                        <TableHead className="hidden md:table-cell font-semibold text-muted-foreground/80 h-12">CPF</TableHead>
                                        <TableHead className="hidden lg:table-cell font-semibold text-muted-foreground/80 h-12">Instituição</TableHead>
                                        <TableHead className="hidden sm:table-cell font-semibold text-muted-foreground/80 h-12">Cargo</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground/80 h-12">Status</TableHead>
                                        <TableHead className="text-right font-semibold text-muted-foreground/80 pr-6 h-12">Ação / Check-in</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((p) => (
                                        <TableRow key={p.id} className="hover:bg-muted/20 border-b border-border/40 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex size-10 items-center justify-center rounded-full font-bold text-sm shrink-0 transition-colors ${p.presente ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'
                                                        }`}>
                                                        {p.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground text-sm">{p.nome}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="size-3" /> {p.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">
                                                {p.cpf}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {p.instituicao}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                                                {p.cargo}
                                            </TableCell>
                                            <TableCell>
                                                {p.presente ? (
                                                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 gap-1 pl-1 pr-2">
                                                        <CheckCircle2 className="size-3.5 text-white" />
                                                        Presente
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="gap-1 pl-1 pr-2 text-muted-foreground border-border">
                                                        <XCircle className="size-3.5" />
                                                        Ausente
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    size="sm"
                                                    variant={p.presente ? 'ghost' : 'default'}
                                                    onClick={() => handleToggle(p.id)}
                                                    disabled={togglingId === p.id}
                                                    className={`gap-1.5 min-w-[100px] transition-all duration-300 ${p.presente
                                                        ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                                                        : 'shadow-sm hover:shadow-md'
                                                        }`}
                                                >
                                                    {togglingId === p.id ? (
                                                        <Spinner className="size-3.5" />
                                                    ) : p.presente ? (
                                                        <>
                                                            <XCircle className="size-3.5" />
                                                            <span className="hidden sm:inline">Cancelar</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="size-3.5" />
                                                            <span className="hidden sm:inline">Confirmar</span>
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(p.id, p.nome)}
                                                    disabled={deletingId === p.id}
                                                    className="gap-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-all"
                                                    title="Excluir inscrição"
                                                >
                                                    {deletingId === p.id ? (
                                                        <Spinner className="size-3.5" />
                                                    ) : (
                                                        <Trash2 className="size-3.5" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

                {filtered.length > 0 && (
                    <div className="bg-muted/5 p-4 border-t border-border/40">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                Exibindo <strong>{filtered.length}</strong> resultados
                            </span>
                            <span>
                                Total de <strong>{participants.length}</strong> participantes cadastrados
                            </span>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
