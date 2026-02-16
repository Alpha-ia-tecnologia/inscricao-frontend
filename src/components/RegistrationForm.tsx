import { useState, useRef, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { formatCPF, formatPhone, validateCPF, validateEmail } from '@/lib/validators'
import { submitRegistration, fetchVagas } from '@/lib/api'
import { useRegistrationModal } from '@/hooks/use-registration-modal'
import { useSettings } from '@/contexts/SettingsContext'
import {
    PenLine,
    CheckCircle2,
    Check,
    AlertTriangle,
    X,
    CalendarDays,
} from 'lucide-react'

// ── Types ──
interface FormData {
    nome: string
    cpf: string
    email: string
    telefone: string
    instituicao: string
    cargo: string
    dia_participacao: string
}

interface FormErrors {
    nome?: string
    cpf?: string
    email?: string
    telefone?: string
    instituicao?: string
    cargo?: string
    dia_participacao?: string
}

// ── Constants ──

const cargos = [
    'Selecione seu cargo/função',
    'Professor(a)',
    'Coordenador(a) Pedagógico(a)',
    'Diretor(a)',
    'Vice-Diretor(a)',
    'Supervisor(a)',
    'Técnico(a) Educacional',
    'Agente Administrativo',
    'Outro',
]

const benefits = [
    'Inscrição 100% gratuita',
    'Certificado de 40 horas',
    'Palestrantes renomados',
    'Oficinas práticas e interativas',
    'Material de apoio pedagógico',
    'Certificado enviado por e-mail',
]

// ── CTA Section (inline on the page) ──
export function RegistrationCTA() {
    const { openModal } = useRegistrationModal()

    return (
        <section id="inscricao" className="relative py-24 lg:py-32 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/cta-bg.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    {/* Left: Content */}
                    <div className="reveal space-y-8 text-white">
                        <div>
                            <Badge className="bg-white/20 hover:bg-white/20 text-white border-none mb-4 backdrop-blur-sm">
                                <PenLine className="size-3 mr-2" />
                                Inscrições Abertas
                            </Badge>
                            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                                Garanta sua Participação
                            </h2>
                            <p className="mt-4 text-lg text-white/80 leading-relaxed max-w-xl">
                                Junte-se a centenas de educadores e faça parte da transformação da educação em Tuntum.
                                Inscrição 100% gratuita e com certificado digital.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {benefits.map((benefit) => (
                                <li key={benefit} className="flex items-center gap-3">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                                        <Check className="size-4" />
                                    </span>
                                    <span className="text-base font-medium text-white">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Glass Card CTA */}
                    <div className="reveal lg:pl-12">
                        <Card className="border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl text-center">
                            <CardContent className="py-12 px-8 space-y-8">
                                <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner">
                                    <PenLine className="size-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-display text-2xl font-bold text-white">Inscrição Rápida</h3>
                                    <p className="text-white/70">
                                        Preencha o formulário em menos de 2 minutos.
                                    </p>
                                </div>
                                <Button
                                    size="xl"
                                    className="w-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/10 text-lg font-bold h-14"
                                    onClick={openModal}
                                >
                                    Fazer Inscrição Agora
                                </Button>
                                <p className="text-xs text-white/40">
                                    Vagas limitadas. Garanta a sua agora mesmo.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ── Modal Form ──
export function RegistrationModal() {
    const { isOpen, closeModal } = useRegistrationModal()
    const { eventName } = useSettings()
    const formRef = useRef<HTMLFormElement>(null)
    const [formData, setFormData] = useState<FormData>({
        nome: '', cpf: '', email: '', telefone: '', instituicao: '', cargo: '', dia_participacao: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    if (!isOpen && !showSuccess) return null

    return <RegistrationFormInner isOpen={isOpen} showSuccess={showSuccess} closeModal={closeModal} setShowSuccess={setShowSuccess} eventName={eventName} formRef={formRef} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} touched={touched} setTouched={setTouched} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} />
}

// Inner component that uses hooks freely
function RegistrationFormInner({ showSuccess, closeModal, setShowSuccess, eventName, formRef, formData, setFormData, errors, setErrors, touched, setTouched, isSubmitting, setIsSubmitting }: {
    isOpen: boolean; showSuccess: boolean; closeModal: () => void; setShowSuccess: (v: boolean) => void; eventName: string; formRef: React.RefObject<HTMLFormElement | null>;
    formData: FormData; setFormData: (v: FormData | ((prev: FormData) => FormData)) => void;
    errors: FormErrors; setErrors: (v: FormErrors | ((prev: FormErrors) => FormErrors)) => void;
    touched: Record<string, boolean>; setTouched: (v: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
    isSubmitting: boolean; setIsSubmitting: (v: boolean) => void;
}) {
    const [vagas, setVagas] = useState<{ dia1: { total: number; max: number; disponivel: number }; dia2: { total: number; max: number; disponivel: number } } | null>(null)

    useEffect(() => {
        fetchVagas().then(setVagas).catch(console.error)
    }, [])

    function validate(data: FormData): FormErrors {
        const errs: FormErrors = {}
        if (!data.nome.trim() || data.nome.trim().length < 5) errs.nome = 'Informe seu nome completo'
        if (!validateCPF(data.cpf)) errs.cpf = 'CPF inválido'
        if (!validateEmail(data.email)) errs.email = 'E-mail inválido'
        if (data.telefone.replace(/\D/g, '').length < 10) errs.telefone = 'Telefone inválido'
        if (!data.instituicao.trim() || data.instituicao.trim().length < 3) errs.instituicao = 'Informe a instituição/escola'
        if (!data.cargo || data.cargo === cargos[0]) errs.cargo = 'Selecione seu cargo'
        if (!data.dia_participacao) errs.dia_participacao = 'Selecione o dia de participação'
        return errs
    }

    function handleChange(field: keyof FormData, value: string) {
        let formatted = value
        if (field === 'cpf') formatted = formatCPF(value)
        if (field === 'telefone') formatted = formatPhone(value)

        const newData = { ...formData, [field]: formatted }
        setFormData(newData)

        if (touched[field]) {
            const newErrors = validate(newData)
            setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
        }
    }

    function handleBlur(field: keyof FormData) {
        setTouched((prev) => ({ ...prev, [field]: true }))
        const newErrors = validate(formData)
        setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const allTouched = { nome: true, cpf: true, email: true, telefone: true, instituicao: true, cargo: true, dia_participacao: true }
        setTouched(allTouched)
        const validationErrors = validate(formData)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) return

        setIsSubmitting(true)
        try {
            await submitRegistration(formData)
            setShowSuccess(true)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao realizar inscrição'
            if (message.includes('CPF já inscrito')) {
                setErrors((prev) => ({ ...prev, cpf: 'Este CPF já está inscrito neste evento' }))
            } else {
                setErrors((prev) => ({ ...prev, nome: message }))
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleCloseSuccess() {
        setShowSuccess(false)
        setFormData({ nome: '', cpf: '', email: '', telefone: '', instituicao: '', cargo: '', dia_participacao: '' })
        setTouched({})
        setErrors({})
        closeModal()
    }

    function handleClose() {
        if (!isSubmitting) closeModal()
    }

    function FieldError({ message }: { message?: string }) {
        if (!message) return null
        return (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                <AlertTriangle className="size-3" />
                {message}
            </p>
        )
    }

    // ── Success overlay ──
    if (showSuccess) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={(e) => e.target === e.currentTarget && handleCloseSuccess()}
            >
                <div className="w-full max-w-md animate-scale-in rounded-2xl bg-card p-8 text-center shadow-2xl">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
                        <CheckCircle2 className="size-8 text-success" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Inscrição Confirmada!</h2>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        Parabéns, <strong className="text-foreground">{formData.nome.split(' ')[0]}</strong>! Sua inscrição na
                        {' '}{eventName} foi realizada com sucesso.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Um e-mail de confirmação será enviado para{' '}
                        <span className="font-medium text-primary">{formData.email}</span>.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Após o evento, o certificado de participação será enviado para o seu e-mail.
                    </p>
                    <Button size="lg" className="mt-6 w-full" onClick={handleCloseSuccess}>
                        Entendi ✓
                    </Button>
                </div>
            </div>
        )
    }

    // ── Form modal ──
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <Card className="w-full max-w-lg shadow-2xl animate-scale-in my-4 relative">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer z-10"
                >
                    <X className="size-4" />
                </button>

                <CardHeader className="pr-12">
                    <div className="flex items-center gap-3 mb-1">
                        <img src="/images/brasao-tuntum.png" alt="Brasão de Tuntum" className="h-14 w-auto" />
                        <div>
                            <CardTitle className="text-xl">Formulário de Inscrição</CardTitle>
                            <CardDescription>{eventName} — Tuntum, MA</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Nome */}
                        <div className="space-y-1.5">
                            <Label htmlFor="nome">Nome Completo <span className="text-destructive">*</span></Label>
                            <Input
                                id="nome"
                                placeholder="Ex: Maria da Silva Santos"
                                value={formData.nome}
                                onChange={(e) => handleChange('nome', e.target.value)}
                                onBlur={() => handleBlur('nome')}
                                aria-invalid={!!errors.nome && !!touched.nome}
                                autoComplete="name"
                            />
                            {touched.nome && <FieldError message={errors.nome} />}
                        </div>

                        {/* CPF + Telefone row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="cpf">CPF <span className="text-destructive">*</span></Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={(e) => handleChange('cpf', e.target.value)}
                                    onBlur={() => handleBlur('cpf')}
                                    aria-invalid={!!errors.cpf && !!touched.cpf}
                                    inputMode="numeric"
                                />
                                {touched.cpf && <FieldError message={errors.cpf} />}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="telefone">Telefone/WhatsApp <span className="text-destructive">*</span></Label>
                                <Input
                                    id="telefone"
                                    placeholder="(99) 99999-0000"
                                    value={formData.telefone}
                                    onChange={(e) => handleChange('telefone', e.target.value)}
                                    onBlur={() => handleBlur('telefone')}
                                    aria-invalid={!!errors.telefone && !!touched.telefone}
                                    inputMode="tel"
                                />
                                {touched.telefone && <FieldError message={errors.telefone} />}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                aria-invalid={!!errors.email && !!touched.email}
                                autoComplete="email"
                            />
                            {touched.email && <FieldError message={errors.email} />}
                        </div>

                        {/* Instituição */}
                        <div className="space-y-1.5">
                            <Label htmlFor="instituicao">Instituição/Escola <span className="text-destructive">*</span></Label>
                            <Input
                                id="instituicao"
                                placeholder="Ex: E.M. Centro de Ensino Isaac Martins"
                                value={formData.instituicao}
                                onChange={(e) => handleChange('instituicao', e.target.value)}
                                onBlur={() => handleBlur('instituicao')}
                                aria-invalid={!!errors.instituicao && !!touched.instituicao}
                            />
                            {touched.instituicao && <FieldError message={errors.instituicao} />}
                        </div>

                        {/* Cargo */}
                        <div className="space-y-1.5">
                            <Label htmlFor="cargo">Cargo/Função <span className="text-destructive">*</span></Label>
                            <select
                                id="cargo"
                                className={`h-10 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${errors.cargo && touched.cargo
                                    ? 'border-destructive ring-destructive/20'
                                    : 'border-input'
                                    }`}
                                value={formData.cargo}
                                onChange={(e) => handleChange('cargo', e.target.value)}
                                onBlur={() => handleBlur('cargo')}
                            >
                                {cargos.map((cargo, i) => (
                                    <option key={i} value={i === 0 ? '' : cargo}>{cargo}</option>
                                ))}
                            </select>
                            {touched.cargo && <FieldError message={errors.cargo} />}
                        </div>

                        {/* Dia de Participação */}
                        <div className="space-y-2">
                            <Label>Dia de Participação <span className="text-destructive">*</span></Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'dia1', label: '1º Dia', sub: 'Gestores, Coordenadores e Equipe Técnica da SEMED' },
                                    { value: 'dia2', label: '2º Dia', sub: 'Professores, Gestores, Coordenadores e Equipe da SEMED' },
                                    { value: 'ambos', label: 'Ambos', sub: 'Todos os dias' },
                                ].map((opt) => {
                                    const diaKey = opt.value as 'dia1' | 'dia2' | 'ambos'
                                    let esgotado = false
                                    let restantes: number | null = null

                                    if (vagas) {
                                        if (diaKey === 'dia1') {
                                            esgotado = vagas.dia1.disponivel <= 0
                                            restantes = vagas.dia1.disponivel
                                        } else if (diaKey === 'dia2') {
                                            esgotado = vagas.dia2.disponivel <= 0
                                            restantes = vagas.dia2.disponivel
                                        } else {
                                            // ambos: disabled if either day is full
                                            esgotado = vagas.dia1.disponivel <= 0 || vagas.dia2.disponivel <= 0
                                            restantes = Math.min(vagas.dia1.disponivel, vagas.dia2.disponivel)
                                        }
                                    }

                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            disabled={esgotado}
                                            onClick={() => {
                                                if (esgotado) return
                                                handleChange('dia_participacao', opt.value)
                                                setTouched((prev) => ({ ...prev, dia_participacao: true }))
                                            }}
                                            className={`cursor-pointer relative flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-all duration-200 ${esgotado
                                                ? 'border-destructive/30 bg-destructive/5 opacity-60 cursor-not-allowed'
                                                : formData.dia_participacao === opt.value
                                                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-[1.03]'
                                                    : 'border-border bg-card hover:border-primary/30'
                                                } ${errors.dia_participacao && touched.dia_participacao && !formData.dia_participacao ? 'border-destructive' : ''}`}
                                        >
                                            {esgotado && (
                                                <span className="absolute -top-2 -right-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                                    Esgotado
                                                </span>
                                            )}
                                            {!esgotado && formData.dia_participacao === opt.value && (
                                                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
                                                    <Check className="size-3 text-primary" />
                                                </span>
                                            )}
                                            <CalendarDays className={`size-5 ${esgotado ? 'text-destructive/50' : formData.dia_participacao === opt.value ? 'text-white' : 'text-muted-foreground'
                                                }`} />
                                            <span className={`text-sm font-bold ${esgotado ? 'text-destructive/60' : formData.dia_participacao === opt.value ? 'text-white' : 'text-foreground'
                                                }`}>{opt.label}</span>
                                            <span className={`text-xs leading-tight ${esgotado ? 'text-destructive/40' : formData.dia_participacao === opt.value ? 'text-white/80' : 'text-muted-foreground'
                                                }`}>{opt.sub}</span>
                                            {vagas && !esgotado && restantes !== null && (
                                                <span className={`text-[10px] font-medium mt-0.5 ${formData.dia_participacao === opt.value ? 'text-white/70' : 'text-primary/70'
                                                    }`}>
                                                    {restantes} {restantes === 1 ? 'vaga restante' : 'vagas restantes'}
                                                </span>
                                            )}
                                            {esgotado && (
                                                <span className="text-[10px] font-bold text-destructive mt-0.5">
                                                    Vagas Esgotadas
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            {touched.dia_participacao && <FieldError message={errors.dia_participacao} />}
                        </div>

                        {/* Submit */}
                        <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Spinner className="size-4" />
                                    Processando inscrição...
                                </>
                            ) : (
                                'Confirmar Inscrição →'
                            )}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                            Ao se inscrever, você concorda com nossa{' '}
                            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
                                política de privacidade
                            </a>.
                            Seus dados são protegidos.
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
