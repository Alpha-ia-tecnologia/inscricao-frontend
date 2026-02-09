import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { useSettings } from '@/contexts/SettingsContext'
import {
    BookOpen,
    Users,
    Award,
    Lightbulb,
    Target,
    GraduationCap,
} from 'lucide-react'

const highlights = [
    { icon: BookOpen, title: 'Formação Continuada', desc: 'Atualização metodológica e pedagógica para educadores' },
    { icon: Users, title: 'Troca de Experiências', desc: 'Networking com profissionais de toda a rede municipal' },
    { icon: Award, title: 'Certificação', desc: 'Certificado digital de 40 horas com validade nacional' },
    { icon: Lightbulb, title: 'Inovação', desc: 'Novas ferramentas e tecnologias para a sala de aula' },
    { icon: Target, title: 'BNCC na Prática', desc: 'Estratégias para alinhar o currículo à Base Nacional Comum' },
    { icon: GraduationCap, title: 'Oficinas', desc: 'Atividades práticas e aplicáveis ao dia-a-dia escolar' },
]

export function About() {
    useScrollReveal()
    const { eventName } = useSettings()

    return (
        <section id="sobre" className="relative bg-background py-20 lg:py-28 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Content */}
                    <div className="reveal space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/images/brasao-tuntum.png" alt="Brasão de Tuntum" className="h-12 w-auto" />
                                <Badge variant="outline" className="border-primary/30 text-primary">
                                    Sobre o Evento
                                </Badge>
                            </div>
                            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl leading-tight">
                                Transformando a Educação <br />
                                <span className="text-primary">Através do Conhecimento</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                A Jornada Pedagógica de Tuntum-MA é o marco inicial do ano letivo de 2026.
                                Um momento dedicado a fortalecer nossa rede de ensino, alinhando estratégias
                                e renovando o compromisso com uma educação pública de excelência.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {highlights.map((item) => (
                                <Card
                                    key={item.title}
                                    className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                                >
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <item.icon className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right: Image using new asset */}
                    <div className="reveal relative order-1 lg:order-2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-[4/3] lg:aspect-square">
                            <img
                                src="/images/about-section.jpg"
                                alt="Educadores reunidos"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                            {/* Floating Stats or Caption */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                <p className="font-display font-bold text-lg">{eventName}</p>
                                <p className="text-sm text-white/80">Construindo o futuro da educação municipal</p>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -z-10 top-1/2 -right-12 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -z-10 -bottom-12 -left-12 w-48 h-48 bg-gold/20 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    )
}
