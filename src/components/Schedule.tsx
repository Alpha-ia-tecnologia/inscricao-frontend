import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRegistrationModal } from '@/hooks/use-registration-modal'
import { CalendarDays, Clock, PenLine, User, Mic2, Coffee, BookOpen } from 'lucide-react'

interface ScheduleItem {
    time: string
    title: string
    desc: string
    speaker?: string
    speakerBio?: string
    type?: 'palestra' | 'intervalo' | 'abertura' | 'credenciamento' | 'encerramento'
}

const day1Items: ScheduleItem[] = [
    {
        time: '08h30',
        title: 'Formação em Liderança, Gestão Estratégica e Competências do Gestor Moderno',
        desc: 'Formação de Gestores, Coordenadores e Equipe Técnica da SEMED',
        speaker: 'Professora Mestra Fabricia Winkler',
        speakerBio: 'Pedagoga com 30 anos de experiência em educação; Psicologia (cursando); Esp. em Neurociência e Comportamento Humano; Gestão; Gestão e Docência do Ensino Superior. Mestra em Tec. Educacional; Empreendedora na área da educação e saúde; Formadora e mediadora convidada do MEC desde 2009; Consultora e Assessora educacional em instituições públicas e privadas; Docente em graduação e pós-graduação; Conferencista e Palestrante atuante nos seminários pelo Brasil.',
        type: 'palestra',
    },
    {
        time: '14h00',
        title: 'Formação em Liderança Resolutiva e Proativa',
        desc: 'Transformando desafios em possibilidades – Matriz RACI',
        speaker: 'Professora Mestra Fabricia Winkler',
        type: 'palestra',
    },
]

const day2Items: ScheduleItem[] = [
    {
        time: '08h00',
        title: 'Credenciamento',
        desc: 'Recepção e acolhimento dos participantes',
        type: 'credenciamento',
    },
    {
        time: '08h30',
        title: 'Abertura Oficial',
        desc: 'Apresentação Cultural e Fala Institucional',
        type: 'abertura',
    },
    {
        time: '10h30',
        title: 'Humanização no Mundo Digital',
        desc: 'Competências Socioemocionais como base da Educação 5.0',
        speaker: 'Nataniel Andrade',
        speakerBio: 'Master Coach e Trainer Febracis São Luís; Empresário; Formado em Administração de Empresas pelo CEUMA; MBA Gestão de Pessoas pela CEUT/PI; +7 anos de experiência com CIS; +2 mil horas em atendimentos individuais; +4 mil horas em palestras, cursos e treinamentos; Atua nas áreas Life, Business e Finanças; Domina assuntos como reprogramação de crenças, vendas, desenvolvimento pessoal/profissional e treinamentos de equipes.',
        type: 'palestra',
    },
    {
        time: '12h00',
        title: 'Intervalo para Almoço',
        desc: '',
        type: 'intervalo',
    },
    {
        time: '14h00',
        title: 'Ferramentas de IA na Personalização do Ensino',
        desc: 'Como a Inteligência Artificial pode transformar a experiência de aprendizagem',
        speaker: 'Prof. João Batista Bottentuit Junior',
        speakerBio: 'Doutor em Ciências da Educação (Tecnologia Educativa) pela Universidade do Minho; Mestre em Educação Multimídia pela Universidade do Porto; Tecnólogo em Processamento de Dados pelo Centro Universitário UNA; Licenciado em Pedagogia pela Faculdade do Maranhão. Professor Associado III da Universidade Federal do Maranhão (UFMA). Professor Permanente dos Programas de Pós-graduação em Cultura e Sociedade e Gestão de Ensino da Educação Básica. Líder do grupo de Estudos e Pesquisas em Tecnologias Digitais na Educação (GEP-TDE). Membro do comitê científico da ABED desde 2012.',
        type: 'palestra',
    },
    {
        time: '15h30',
        title: 'Lanche',
        desc: '',
        type: 'intervalo',
    },
    {
        time: '16h00',
        title: 'Cultura Digital e Pensamento Computacional',
        desc: 'Integrando as novas tecnologias ao currículo escolar',
        speaker: 'Ronaldo Pimentel',
        speakerBio: 'Cientista da Computação qualificado, licenciado em Matemática e especialista em Engenharia de Inteligência Artificial, com sólida experiência em métodos ágeis. Comprometido em proporcionar soluções inovadoras, criador de soluções inteligentes para diversos setores.',
        type: 'palestra',
    },
    {
        time: '17h00',
        title: 'Encerramento',
        desc: 'Encerramento oficial do I Simpósio de Educação de Tuntum 2026',
        type: 'encerramento',
    },
]

function getTypeIcon(type?: string) {
    switch (type) {
        case 'palestra': return <Mic2 className="size-12 text-primary" />
        case 'intervalo': return <Coffee className="size-12 text-primary" />
        case 'abertura': return <BookOpen className="size-12 text-primary" />
        case 'credenciamento': return <User className="size-12 text-primary" />
        case 'encerramento': return <BookOpen className="size-12 text-primary" />
        default: return <Clock className="size-12 text-primary" />
    }
}

export function Schedule() {
    const { openModal } = useRegistrationModal()
    const [activeDay, setActiveDay] = useState<1 | 2>(1)

    const currentItems = activeDay === 1 ? day1Items : day2Items

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
                        Dois dias de formação, palestras e troca de experiências para fortalecer a educação de Tuntum.
                    </p>
                </div>

                {/* Day Tabs */}
                <div className="flex justify-center gap-3 mb-10">
                    <button
                        onClick={() => setActiveDay(1)}
                        className={`cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeDay === 1
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary'
                            }`}
                    >
                        <span className="block text-xs opacity-70 mb-0.5">25 de Fevereiro</span>
                        1º Dia — Gestores e Equipe Técnica
                    </button>
                    <button
                        onClick={() => setActiveDay(2)}
                        className={`cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeDay === 2
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary'
                            }`}
                    >
                        <span className="block text-xs opacity-70 mb-0.5">26 de Fevereiro</span>
                        2º Dia — Educação 5.0
                    </button>
                </div>

                {/* Day description */}
                {activeDay === 1 && (
                    <div className="text-center mb-8">
                        <p className="text-primary font-semibold text-lg">Gestores, Coordenadores e Equipe Técnica da SEMED</p>
                        <p className="text-muted-foreground text-sm mt-1">Formação em Liderança e Gestão Estratégica</p>
                    </div>
                )}
                {activeDay === 2 && (
                    <div className="text-center mb-8">
                        <p className="text-primary font-semibold text-lg">Professores, Gestores, Coordenadores e Equipe da SEMED</p>
                        <p className="text-muted-foreground text-sm mt-1">Educação 5.0 — Integração entre Tecnologia, Humanização e Inovação Pedagógica</p>
                    </div>
                )}

                {/* Schedule Items */}
                <div className="space-y-6">
                    {currentItems.map((item, i) => (
                        <div
                            key={`${activeDay}-${i}`}
                            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                            style={{ transitionDelay: `${i * 0.05}s` }}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {getTypeIcon(item.type)}
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                                    {item.time}
                                </span>
                                <h4 className="font-semibold text-lg text-foreground mb-2">{item.title}</h4>
                                {item.desc && <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>}

                                {item.speaker && (
                                    <div className="mt-3 pt-3 border-t border-border/50">
                                        <p className="text-sm font-semibold text-primary flex items-center gap-2">
                                            <User className="size-4" />
                                            {item.speaker}
                                        </p>
                                        {item.speakerBio && (
                                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                                {item.speakerBio}
                                            </p>
                                        )}
                                    </div>
                                )}
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
