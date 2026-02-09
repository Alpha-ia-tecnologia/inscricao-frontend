import { Star, ArrowRight } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

export function AvaliacaoCTA() {
    const { eventName } = useSettings()
    useScrollReveal()

    return (
        <section id="avaliacao" className="reveal py-20 px-6">
            <div className="mx-auto max-w-4xl">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/95 to-primary/90 p-10 md:p-14 text-center shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10">
                        {/* Stars */}
                        <div className="flex justify-center gap-1.5 mb-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className="size-7 fill-accent text-accent drop-shadow-[0_0_8px_rgba(212,168,83,0.4)] animate-pulse-soft"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>

                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                            Avalie o Evento
                        </h2>
                        <p className="text-white/80 max-w-lg mx-auto mb-8 leading-relaxed">
                            Participou da <strong className="text-white">{eventName}</strong>? Sua opinião é essencial para melhorarmos os próximos eventos. Leva menos de 1 minuto!
                        </p>

                        <a
                            href="/avaliacao"
                            className="inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-8 py-4 font-bold text-lg shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300"
                        >
                            Avaliar Agora <ArrowRight className="size-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
