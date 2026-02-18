import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Spinner } from '@/components/ui/spinner'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { adminLogin } from '@/lib/api'

export function AdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await adminLogin(email, senha)
            navigate('/admin/dashboard')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary/90 overflow-hidden items-center justify-center text-white p-12">
                <div className="absolute inset-0">
                    <img
                        src="/images/about-section.jpg"
                        alt="Jornada Pedagógica"
                        className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40" />
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                        <img src="/images/brasao-tuntum.png" alt="Brasão" className="h-20 w-auto brightness-0 invert opacity-90" />
                        <div className="h-12 w-px bg-white/30" />
                        <div>
                            <p className="font-bold text-lg leading-none tracking-wide text-white/90">SEMED</p>
                            <p className="text-sm font-light text-white/70 tracking-widest">TUNTUM - MA</p>
                        </div>
                    </div>

                    <h1 className="font-display text-5xl font-bold leading-tight">
                        Gestão da <br />
                        <span className="text-cyan-300">Jornada Pedagógica</span>
                    </h1>

                    <p className="text-lg text-white/80 leading-relaxed">
                        Painel administrativo para gerenciamento de inscrições, participantes e certificados do evento.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="font-display text-3xl font-bold text-foreground">Bem-vindo(a) de volta</h2>
                        <p className="mt-2 text-muted-foreground">
                            Informe suas credenciais para acessar o painel.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive animate-shake">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail Institucional</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@semed.tuntum.ma.gov.br"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11 bg-muted/30 border-input/60 focus:bg-background transition-all"
                                        required
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="senha">Senha</Label>
                                    <a href="#" className="text-xs font-medium text-primary hover:text-primary/80">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="senha"
                                        type="password"
                                        placeholder="••••••••"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        className="pl-10 h-11 bg-muted/30 border-input/60 focus:bg-background transition-all"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                disabled={loading}
                            >
                                {loading && <Spinner className="mr-2 size-4" />}
                                {loading ? 'Autenticando...' : 'Acessar Painel'}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full h-11 text-muted-foreground hover:text-foreground"
                                onClick={() => navigate('/')}
                            >
                                ← Voltar para o Site
                            </Button>
                        </div>
                    </form>

                    <div className="pt-6 border-t border-border/40 text-center">
                        <p className="text-xs text-muted-foreground">
                            &copy; 2026 SEMED Tuntum • Todos os direitos reservados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
