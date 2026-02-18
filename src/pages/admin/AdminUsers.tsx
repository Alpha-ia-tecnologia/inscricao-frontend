import { useState, useEffect } from 'react'
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    UserCog,
    Plus,
    Pencil,
    Trash2,
    X,
    CheckCircle,
    AlertCircle,
    Mail,
    User,
    Lock,
    Shield,
    Loader2,
} from 'lucide-react'

interface Admin {
    id: number
    nome: string
    email: string
    created_at: string
}

interface FormData {
    nome: string
    email: string
    senha: string
}

const emptyForm: FormData = { nome: '', email: '', senha: '' }

export function AdminUsers() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState<FormData>(emptyForm)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    useEffect(() => {
        loadAdmins()
    }, [])

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [feedback])

    async function loadAdmins() {
        try {
            const data = await fetchAdmins()
            setAdmins(data)
        } catch (err) {
            setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao carregar' })
        } finally {
            setLoading(false)
        }
    }

    function handleNew() {
        setEditingId(null)
        setForm(emptyForm)
        setShowForm(true)
        setFeedback(null)
    }

    function handleEdit(admin: Admin) {
        setEditingId(admin.id)
        setForm({ nome: admin.nome, email: admin.email, senha: '' })
        setShowForm(true)
        setFeedback(null)
    }

    function handleCancel() {
        setShowForm(false)
        setEditingId(null)
        setForm(emptyForm)
    }

    async function handleSave() {
        if (!form.nome.trim() || !form.email.trim()) return
        if (!editingId && !form.senha.trim()) return

        setSaving(true)
        setFeedback(null)
        try {
            if (editingId) {
                await updateAdmin(editingId, {
                    nome: form.nome,
                    email: form.email,
                    ...(form.senha.trim() ? { senha: form.senha } : {}),
                })
                setFeedback({ type: 'success', message: 'Administrador atualizado com sucesso!' })
            } else {
                await createAdmin({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                })
                setFeedback({ type: 'success', message: 'Administrador criado com sucesso!' })
            }
            handleCancel()
            await loadAdmins()
        } catch (err) {
            setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao salvar' })
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setFeedback(null)
        try {
            await deleteAdmin(id)
            setFeedback({ type: 'success', message: 'Administrador excluído com sucesso!' })
            setConfirmDeleteId(null)
            await loadAdmins()
        } catch (err) {
            setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao excluir' })
        } finally {
            setDeletingId(null)
        }
    }

    function formatDate(dateStr: string) {
        try {
            const d = new Date(dateStr)
            return d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
        } catch {
            return dateStr
        }
    }

    const isFormValid = form.nome.trim() && form.email.trim() && (editingId || form.senha.trim())

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20">
                            <UserCog className="size-5" />
                        </div>
                        Gerenciamento de Usuários
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Gerencie os administradores que têm acesso ao painel.
                    </p>
                </div>
                <Button onClick={handleNew} className="gap-2 shadow-md">
                    <Plus className="size-4" />
                    Novo Administrador
                </Button>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm animate-fade-in-up ${feedback.type === 'success'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {feedback.type === 'success'
                        ? <CheckCircle className="size-4 shrink-0" />
                        : <AlertCircle className="size-4 shrink-0" />
                    }
                    {feedback.message}
                </div>
            )}

            {/* Create/Edit Form */}
            {showForm && (
                <Card className="border-border/60 shadow-sm animate-fade-in-up max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="size-5 text-primary" />
                            {editingId ? 'Editar Administrador' : 'Novo Administrador'}
                        </CardTitle>
                        <CardDescription>
                            {editingId
                                ? 'Atualize os dados abaixo. Deixe a senha em branco para manter a atual.'
                                : 'Preencha os dados do novo administrador.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="admin-nome" className="flex items-center gap-2">
                                    <User className="size-4 text-primary" />
                                    Nome
                                </Label>
                                <Input
                                    id="admin-nome"
                                    value={form.nome}
                                    onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
                                    placeholder="Nome completo"
                                    className="text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-email" className="flex items-center gap-2">
                                    <Mail className="size-4 text-primary" />
                                    E-mail
                                </Label>
                                <Input
                                    id="admin-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="email@exemplo.com"
                                    className="text-base"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <Label htmlFor="admin-senha" className="flex items-center gap-2">
                                <Lock className="size-4 text-primary" />
                                {editingId ? 'Nova Senha (opcional)' : 'Senha'}
                            </Label>
                            <Input
                                id="admin-senha"
                                type="password"
                                value={form.senha}
                                onChange={(e) => setForm(f => ({ ...f, senha: e.target.value }))}
                                placeholder={editingId ? 'Deixe vazio para manter' : 'Mínimo 6 caracteres'}
                                className="text-base"
                            />
                            {!editingId && (
                                <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres.</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={handleSave}
                                disabled={saving || !isFormValid}
                                className="gap-2"
                            >
                                {saving
                                    ? <><Loader2 className="size-4 animate-spin" /> Salvando...</>
                                    : <><CheckCircle className="size-4" /> {editingId ? 'Atualizar' : 'Criar Administrador'}</>
                                }
                            </Button>
                            <Button variant="outline" onClick={handleCancel} className="gap-2">
                                <X className="size-4" />
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Admins Table */}
            <Card className="border-border/60 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Administradores Cadastrados</CardTitle>
                    <CardDescription>
                        {loading ? 'Carregando...' : `${admins.length} administrador${admins.length !== 1 ? 'es' : ''} no sistema`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <UserCog className="size-12 mx-auto mb-3 opacity-30" />
                            <p>Nenhum administrador encontrado.</p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border/60 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Nome</TableHead>
                                        <TableHead className="font-semibold">E-mail</TableHead>
                                        <TableHead className="font-semibold">Criado em</TableHead>
                                        <TableHead className="font-semibold text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <TableRow key={admin.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                        {admin.nome.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-foreground">{admin.nome}</span>
                                                        {admin.id === 1 && (
                                                            <Badge variant="outline" className="ml-2 text-xs border-primary/30 text-primary">
                                                                Principal
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                                            <TableCell className="text-muted-foreground">{formatDate(admin.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(admin)}
                                                        className="gap-1.5 text-muted-foreground hover:text-primary cursor-pointer"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                        Editar
                                                    </Button>
                                                    {confirmDeleteId === admin.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(admin.id)}
                                                                disabled={deletingId === admin.id}
                                                                className="gap-1 cursor-pointer"
                                                            >
                                                                {deletingId === admin.id
                                                                    ? <Loader2 className="size-3.5 animate-spin" />
                                                                    : <Trash2 className="size-3.5" />
                                                                }
                                                                Confirmar
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="cursor-pointer"
                                                            >
                                                                <X className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setConfirmDeleteId(admin.id)}
                                                            className="gap-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            Excluir
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
