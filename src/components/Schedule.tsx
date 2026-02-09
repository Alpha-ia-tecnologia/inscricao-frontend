import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRegistrationModal } from '@/hooks/use-registration-modal'
import { CalendarDays, Clock, PenLine } from 'lucide-react'

const items = [
    { time: '07:30 — 08:00', title: 'Credenciamento', desc: 'Recepção e acolhimento dos participantes' },
    { time: '08:00 — 08:30', title: 'Abertura Oficial', desc: 'Secretária de Educação e autoridades municipais' },
    { time: '08:30 — 10:00', title: 'Palestra Magna', desc: 'Educação transformadora: desafios e perspectivas para 2026' },
    { time: '10:00 — 10:30', title: 'Coffee Break', desc: 'Intervalo para networking e confraternização' },
    { time: '10:30 — 12:00', title: 'Oficinas Temáticas', desc: 'Metodologias ativas, tecnologias educacionais e BNCC' },
    { time: '14:00 — 16:00', title: 'Grupos de Trabalho', desc: 'Construção coletiva do planejamento escolar 2026' },
    { time: '16:00 — 17:00', title: 'Plenária e Encerramento', desc: 'Socialização dos trabalhos e encerramento oficial' },
]

export function Schedule() {
    const { openModal } = useRegistrationModal()

    return (
        <section id="programacao" className="bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-4xl px-6">
                <div className="reveal mb-14 text-center">
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                        <CalendarDays className="size-3" />
                        Programação
                    </Badge>
                    <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                        Programação do Evento
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Uma programação completa para o desenvolvimento profissional dos educadores tuntunenses.
                    </p>
                </div>

                {/* Modern Grid Schedule */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="reveal group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                            style={{ transitionDelay: `${i * 0.05}s` }}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="size-12 text-primary" />
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                                    {item.time}
                                </span>
                                <h4 className="font-semibold text-lg text-foreground mb-2">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>

                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                        </div>
                    ))}
                </div>

                {/* CTA after schedule */}
                <div className="reveal mt-10 text-center">
                    <p className="text-muted-foreground mb-4">
                        Interessou? Garanta sua vaga agora mesmo — é rápido e gratuito.
                    </p>
                    <Button size="lg" className="gap-2" onClick={openModal}>
                        <PenLine className="size-4" />
                        Inscreva-se Agora
                    </Button>
                </div>
            </div>
        </section>
    )
}
