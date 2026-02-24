import { useState, useRef, useEffect } from 'react'
import { confirmCheckin } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import { CalendarDays, UserCheck, CheckCircle2, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react'

type Step = 'select-day' | 'enter-cpf' | 'success' | 'error'

export function CheckinPage() {
    const { eventName } = useSettings()
    const [step, setStep] = useState<Step>('select-day')
    const [selectedDay, setSelectedDay] = useState<string>('')
    const [cpf, setCpf] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ nome: string; message: string; already: boolean } | null>(null)
    const [errorMsg, setErrorMsg] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (step === 'enter-cpf' && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [step])

    function formatCpf(value: string): string {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
        if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    }

    function handleCpfChange(value: string) {
        setCpf(formatCpf(value))
    }

    function selectDay(day: string) {
        setSelectedDay(day)
        setStep('enter-cpf')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const cpfClean = cpf.replace(/\D/g, '')
        if (cpfClean.length !== 11) {
            setErrorMsg('Digite um CPF válido com 11 dígitos.')
            setStep('error')
            return
        }

        setLoading(true)
        try {
            const res = await confirmCheckin(cpfClean, selectedDay)
            setResult(res)
            setStep('success')
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'Erro ao confirmar presença')
            setStep('error')
        } finally {
            setLoading(false)
        }
    }

    function reset() {
        setStep('select-day')
        setSelectedDay('')
        setCpf('')
        setResult(null)
        setErrorMsg('')
    }

    return (
        <div className="min-h-dvh flex flex-col" style={{
            background: 'linear-gradient(135deg, #1E3A6E 0%, #3B6FCB 50%, #00BCD4 100%)',
        }}>
            {/* Header */}
            <header className="pt-8 pb-4 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <UserCheck className="size-5 text-white" />
                    </div>
                </div>
                <h1 className="text-xl font-bold text-white font-display tracking-tight">
                    {eventName}
                </h1>
                <p className="text-white/70 text-sm mt-1">Confirmação de Presença</p>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-start justify-center px-4 pb-8 pt-4">
                <div className="w-full max-w-md">
                    {/* ── Step: Select Day ── */}
                    {step === 'select-day' && (
                        <div className="animate-[fade-in-up_0.5s_ease-out_forwards]">
                            <div className="rounded-2xl p-6 space-y-5" style={{
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}>
                                <div className="text-center">
                                    <CalendarDays className="size-8 text-white/90 mx-auto mb-3" />
                                    <h2 className="text-lg font-semibold text-white">Selecione o dia</h2>
                                    <p className="text-white/60 text-sm mt-1">Escolha o dia de formação para registrar presença</p>
                                </div>

                                <button
                                    onClick={() => selectDay('dia1')}
                                    className="w-full group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-xl text-2xl font-bold text-white" style={{
                                            background: 'linear-gradient(135deg, #3B6FCB, #1E3A6E)',
                                        }}>1</div>
                                        <div>
                                            <p className="font-semibold text-white text-base">1º Dia de Formação</p>
                                            <p className="text-white/60 text-sm">25 de Fevereiro de 2026</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => selectDay('dia2')}
                                    className="w-full group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-xl text-2xl font-bold text-white" style={{
                                            background: 'linear-gradient(135deg, #00BCD4, #0097A7)',
                                        }}>2</div>
                                        <div>
                                            <p className="font-semibold text-white text-base">2º Dia de Formação</p>
                                            <p className="text-white/60 text-sm">26 de Fevereiro de 2026</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step: Enter CPF ── */}
                    {step === 'enter-cpf' && (
                        <div className="animate-[fade-in-up_0.5s_ease-out_forwards]">
                            <div className="rounded-2xl p-6 space-y-5" style={{
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}>
                                <button
                                    onClick={() => { setStep('select-day'); setCpf('') }}
                                    className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
                                >
                                    <ArrowLeft className="size-4" />
                                    Voltar
                                </button>

                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white mb-3" style={{
                                        background: selectedDay === 'dia1'
                                            ? 'linear-gradient(135deg, #3B6FCB, #1E3A6E)'
                                            : 'linear-gradient(135deg, #00BCD4, #0097A7)',
                                    }}>
                                        <CalendarDays className="size-3.5" />
                                        {selectedDay === 'dia1' ? '1º Dia — 25/02' : '2º Dia — 26/02'}
                                    </div>
                                    <h2 className="text-lg font-semibold text-white">Digite seu CPF</h2>
                                    <p className="text-white/60 text-sm mt-1">Confirme sua presença no evento</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            inputMode="numeric"
                                            value={cpf}
                                            onChange={(e) => handleCpfChange(e.target.value)}
                                            placeholder="000.000.000-00"
                                            className="w-full rounded-xl px-5 py-4 text-lg text-center font-semibold tracking-widest outline-none transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal"
                                            style={{
                                                background: 'rgba(255,255,255,0.9)',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                color: '#1E3A6E',
                                            }}
                                            maxLength={14}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || cpf.replace(/\D/g, '').length !== 11}
                                        className="w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                        style={{
                                            background: cpf.replace(/\D/g, '').length === 11
                                                ? 'linear-gradient(135deg, #10B981, #059669)'
                                                : 'rgba(255,255,255,0.2)',
                                            boxShadow: cpf.replace(/\D/g, '').length === 11
                                                ? '0 8px 30px rgba(16, 185, 129, 0.4)'
                                                : 'none',
                                        }}
                                    >
                                        {loading ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-5" />
                                        )}
                                        {loading ? 'Confirmando...' : 'Confirmar Presença'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ── Step: Success ── */}
                    {step === 'success' && result && (
                        <div className="animate-[scale-in_0.4s_ease-out_forwards]">
                            <div className="rounded-2xl p-8 text-center space-y-5" style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                            }}>
                                <div className="relative mx-auto w-fit">
                                    <div className="flex size-20 items-center justify-center rounded-full" style={{
                                        background: result.already
                                            ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                                            : 'linear-gradient(135deg, #10B981, #059669)',
                                        boxShadow: result.already
                                            ? '0 0 60px rgba(245, 158, 11, 0.4)'
                                            : '0 0 60px rgba(16, 185, 129, 0.4)',
                                    }}>
                                        <CheckCircle2 className="size-10 text-white" />
                                    </div>
                                    {/* Pulse ring animation */}
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{
                                        background: result.already
                                            ? 'rgba(245, 158, 11, 0.5)'
                                            : 'rgba(16, 185, 129, 0.5)',
                                        animationDuration: '1.5s',
                                        animationIterationCount: '3',
                                    }} />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{result.nome}</h2>
                                    <p className="text-white/80 text-base">{result.message}</p>
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium" style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    color: 'rgba(255,255,255,0.9)',
                                }}>
                                    <CalendarDays className="size-4" />
                                    {selectedDay === 'dia1' ? '1º Dia — 25/02/2026' : '2º Dia — 26/02/2026'}
                                </div>

                                <button
                                    onClick={reset}
                                    className="w-full rounded-xl px-6 py-3.5 text-sm font-medium text-white/80 transition-all duration-200 hover:text-white hover:bg-white/10"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    Novo Check-in
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step: Error ── */}
                    {step === 'error' && (
                        <div className="animate-[scale-in_0.4s_ease-out_forwards]">
                            <div className="rounded-2xl p-8 text-center space-y-5" style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                            }}>
                                <div className="flex size-20 items-center justify-center rounded-full mx-auto" style={{
                                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                                    boxShadow: '0 0 60px rgba(239, 68, 68, 0.4)',
                                }}>
                                    <AlertTriangle className="size-10 text-white" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">Não foi possível confirmar</h2>
                                    <p className="text-white/80 text-sm leading-relaxed">{errorMsg}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => { setStep('enter-cpf'); setErrorMsg('') }}
                                        className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        style={{
                                            background: 'linear-gradient(135deg, #3B6FCB, #1E3A6E)',
                                            boxShadow: '0 8px 30px rgba(59, 111, 203, 0.3)',
                                        }}
                                    >
                                        Tentar Novamente
                                    </button>
                                    <button
                                        onClick={reset}
                                        className="w-full rounded-xl px-6 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        style={{
                                            border: '1px solid rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        Voltar ao Início
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center">
                <p className="text-white/40 text-xs">
                    © 2026 {eventName} — Sistema de Presença
                </p>
            </footer>
        </div>
    )
}
