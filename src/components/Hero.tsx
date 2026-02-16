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
    Sparkles,
} from 'lucide-react'

export function Hero() {
    const { openModal } = useRegistrationModal()

    return (
        <section className="relative flex items-center overflow-hidden pt-16">
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

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-14 w-full">
                <div className="grid gap-4 lg:grid-cols-2 items-center">
                    {/* Left: text content */}
                    <div className="space-y-3 text-white">
                        {/* Institution badge */}
                        <div>
                            <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm">
                                SEMED — Tuntum, MA
                            </Badge>
                        </div>

                        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            I Simpósio de<br />Educação de Tuntum
                            <span className="block text-gold mt-1">2026</span>
                        </h1>

                        <p className="max-w-lg text-lg text-white/80 leading-relaxed">
                            <Sparkles className="inline size-4 text-gold mr-1" />
                            Seja muito bem-vindo(a) ao nosso evento! Este encontro foi preparado com carinho para promover reflexão, aprendizado e troca de experiências. Que estes dias sejam de inspiração, crescimento profissional e fortalecimento da nossa missão de educar.
                        </p>

                        {/* Info pills */}
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <Calendar className="size-4 text-gold" />
                                25 e 26 Fev 2026
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <MapPin className="size-4 text-gold" />
                                CT Centro de Treinamento Esportivo
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <Clock className="size-4 text-gold" />
                                2 dias de evento
                            </span>
                        </div>

                        {/* Impact phrase */}
                        <p className="text-gold/90 italic text-sm font-medium border-l-2 border-gold/40 pl-4">
                            "Educação é a tecnologia mais poderosa para transformar realidades."
                        </p>

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

                    {/* Right: Event banner card */}
                    <div className="hidden lg:flex justify-end">
                        <Card className="border-white/10 bg-white/10 backdrop-blur-md shadow-2xl max-w-xs">
                            <CardContent className="p-4">
                                {/* Event banner */}
                                <div className="rounded-lg overflow-hidden mb-4 border border-white/10">
                                    <img
                                        src="/images/banner-evento.png"
                                        alt="Banner I Simpósio de Educação de Tuntum 2026"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-white/10 p-3 text-center">
                                        <p className="text-2xl font-bold text-white">2</p>
                                        <p className="text-xs text-white/60">Dias de Evento</p>
                                    </div>
                                    <div className="rounded-lg bg-white/10 p-3 text-center">
                                        <Users className="size-5 text-gold mx-auto mb-1" />
                                        <p className="text-xs text-white/60">Vagas Limitadas</p>
                                    </div>
                                    <div className="col-span-2 rounded-lg bg-white/10 p-3 text-center">
                                        <p className="text-sm font-medium text-gold">✦ Educação 5.0</p>
                                        <p className="text-xs text-white/50 mt-0.5">Tecnologia, Humanização e Inovação</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

        </section >
    )
}
