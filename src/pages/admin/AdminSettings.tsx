import { useState, useEffect } from 'react'
import { fetchSettings, updateSettings } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Save, CheckCircle, AlertCircle, Calendar, MapPin, Clock, Type, Users } from 'lucide-react'

export function AdminSettings() {
    const { refreshSettings } = useSettings()
    const [form, setForm] = useState({
        event_name: '',
        event_date: '',
        event_location: '',
        event_workload: '',
        vagas_dia1: '',
        vagas_dia2: '',
    })
    const [saving, setSaving] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    useEffect(() => {
        fetchSettings().then((s) => {
            setForm({
                event_name: s.event_name || '',
                event_date: s.event_date || '',
                event_location: s.event_location || '',
                event_workload: s.event_workload || '',
                vagas_dia1: s.vagas_dia1 || '500',
                vagas_dia2: s.vagas_dia2 || '500',
            })
        }).catch(console.error)
    }, [])

    function handleChange(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    async function handleSave() {
        if (!form.event_name.trim()) return
        setSaving(true)
        setFeedback(null)
        try {
            await updateSettings(form)
            await refreshSettings()
            setFeedback({ type: 'success', message: 'Configurações atualizadas com sucesso!' })
        } catch (err: unknown) {
            setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao salvar' })
        } finally {
            setSaving(false)
        }
    }

    const fields = [
        {
            key: 'event_name',
            label: 'Nome do Evento',
            placeholder: 'Ex: Jornada Pedagógica 2026',
            icon: Type,
            description: 'Exibido na navbar, footer, e-mails de confirmação, certificados e formulário de inscrição.',
        },
        {
            key: 'event_date',
            label: 'Data do Evento',
            placeholder: 'Ex: 25 e 26 de Fevereiro de 2026',
            icon: Calendar,
            description: 'Exibida no e-mail de confirmação de inscrição e no certificado PDF.',
        },
        {
            key: 'event_location',
            label: 'Local do Evento',
            placeholder: 'Ex: Centro de Convenções — Tuntum, MA',
            icon: MapPin,
            description: 'Exibido no e-mail de confirmação e no certificado.',
        },
        {
            key: 'event_workload',
            label: 'Carga Horária (horas)',
            placeholder: 'Ex: 40',
            icon: Clock,
            description: 'Quantidade de horas para o certificado e e-mail.',
        },
        {
            key: 'vagas_dia1',
            label: 'Vagas — 1º Dia',
            placeholder: 'Ex: 500',
            icon: Users,
            description: 'Limite máximo de inscrições para o 1º dia. Quem selecionar "Ambos" conta para os dois dias.',
        },
        {
            key: 'vagas_dia2',
            label: 'Vagas — 2º Dia',
            placeholder: 'Ex: 500',
            icon: Users,
            description: 'Limite máximo de inscrições para o 2º dia. Quem selecionar "Ambos" conta para os dois dias.',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20">
                        <Settings className="size-5" />
                    </div>
                    Configurações do Evento
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Gerencie os dados do evento que aparecem na confirmação de inscrição, certificados e em toda a plataforma.
                </p>
            </div>

            {/* Settings Card */}
            <Card className="max-w-2xl border-border/60 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Dados do Evento</CardTitle>
                    <CardDescription>
                        Atualize as informações abaixo. As alterações serão refletidas automaticamente
                        nos e-mails, certificados e em toda a plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                            <Label htmlFor={field.key} className="flex items-center gap-2">
                                <field.icon className="size-4 text-primary" />
                                {field.label}
                            </Label>
                            <Input
                                id={field.key}
                                value={form[field.key as keyof typeof form]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="text-base"
                            />
                            <p className="text-xs text-muted-foreground">{field.description}</p>
                        </div>
                    ))}

                    {feedback && (
                        <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${feedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {feedback.type === 'success'
                                ? <CheckCircle className="size-4" />
                                : <AlertCircle className="size-4" />
                            }
                            {feedback.message}
                        </div>
                    )}

                    <Button
                        onClick={handleSave}
                        disabled={saving || !form.event_name.trim()}
                        className="gap-2"
                    >
                        <Save className="size-4" />
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
