import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRegistrationModal } from '@/hooks/use-registration-modal'
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    PenLine,
    ArrowRight,
} from 'lucide-react'

export function Hero() {
    const { openModal } = useRegistrationModal()

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero-bg.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
            </div>

            {/* Floating decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 size-80 rounded-full bg-gold/10 blur-3xl animate-float" />
                <div className="absolute -bottom-32 -right-20 size-96 rounded-full bg-white/5 blur-3xl animate-float-delayed" />
                <div className="absolute top-1/4 right-10 size-40 rounded-full bg-gold/5 blur-2xl animate-float" />
            </div >

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-32 w-full">
                <div className="grid gap-10 lg:grid-cols-2 items-center">
                    {/* Left: text content */}
                    <div className="space-y-6 text-white">
                        {/* Institution badge */}
                        <div>
                            <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm">
                                SEMED — Tuntum, MA
                            </Badge>
                        </div>

                        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            Jornada<br />Pedagógica
                            <span className="block text-gold mt-1">2026</span>
                        </h1>

                        <p className="max-w-lg text-lg text-white/80 leading-relaxed">
                            Formação continuada para educadores de Tuntum-MA. Palestras, oficinas e
                            troca de experiências para fortalecer a educação municipal.
                        </p>

                        {/* Info pills */}
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <Calendar className="size-4 text-gold" />
                                25 e 26 Fev 2026
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <MapPin className="size-4 text-gold" />
                                Tuntum, MA
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <Clock className="size-4 text-gold" />
                                40 horas
                            </span>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button
                                size="xl"
                                className="bg-gold text-primary-dark hover:bg-gold/90 gap-2 shadow-lg shadow-gold/30"
                                onClick={openModal}
                            >
                                <PenLine className="size-4" />
                                Inscreva-se Agora
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-white/30 text-white hover:bg-white/10 gap-2"
                                onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Saiba Mais
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Right: glassmorphism stats card with cityscape */}
                    <div className="hidden lg:block space-y-6">
                        <Card className="border-white/10 bg-white/10 backdrop-blur-md shadow-2xl">
                            <CardContent className="p-6">
                                {/* Mini cityscape illustration */}
                                <div className="rounded-xl overflow-hidden mb-6 border border-white/10">
                                    <img
                                        src="/images/formacao-professores.jpg"
                                        alt="Momento formativo com educadores"
                                        className="w-full h-44 object-cover"
                                    />
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl bg-white/10 p-4 text-center">
                                        <p className="text-3xl font-bold text-white">40h</p>
                                        <p className="text-xs text-white/60">Carga Horária</p>
                                    </div>
                                    <div className="rounded-xl bg-white/10 p-4 text-center">
                                        <Users className="size-6 text-gold mx-auto mb-1" />
                                        <p className="text-xs text-white/60">Vagas Limitadas</p>
                                    </div>
                                    <div className="col-span-2 rounded-xl bg-white/10 p-4 text-center">
                                        <p className="text-sm font-medium text-gold">✦ Certificado Digital Incluso</p>
                                        <p className="text-xs text-white/50 mt-1">Enviado automaticamente por e-mail</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-white/40 text-xs">Rolar para baixo</span>
                    <div className="size-5 rounded-full border-2 border-white/30 flex items-center justify-center">
                        <div className="size-1.5 rounded-full bg-white/50 animate-bounce" />
                    </div>
                </div>
            </div>
        </section >
    )
}
