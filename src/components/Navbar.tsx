import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRegistrationModal } from '@/hooks/use-registration-modal'
import { useSettings } from '@/contexts/SettingsContext'
import { Menu, X, PenLine, Lock, Star } from 'lucide-react'

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { openModal } = useRegistrationModal()
    const { eventName } = useSettings()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const links = [
        { href: '#sobre', label: 'Sobre' },
        { href: '#programacao', label: 'Programação' },
        { href: '#inscricao', label: 'Inscrição' },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-primary/10'
                : 'bg-transparent'
                }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <a
                    href="#"
                    className={`flex items-center gap-2 font-display text-lg font-bold transition-colors ${scrolled ? 'text-primary' : 'text-white'
                        }`}
                >
                    <img src="/images/brasao-tuntum.png" alt="" className="h-20 w-auto" />
                    {eventName}
                </a>

                {/* Desktop links */}
                <ul className="hidden items-center gap-6 md:flex">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-accent ${scrolled ? 'text-foreground' : 'text-white/90'
                                    }`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    <a href="/admin">
                        <Button variant="ghost" size="sm" className={`gap-1.5 ${scrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                            <Lock className="size-3.5" />
                            Área Administrativa
                        </Button>
                    </a>
                    <a href="/avaliacao">
                        <Button variant="outline" size="sm" className={`gap-1.5 border-accent/50 ${scrolled ? 'text-accent hover:bg-accent/10' : 'text-accent border-accent/40 hover:bg-accent/10'}`}>
                            <Star className="size-3.5" />
                            Avaliar Evento
                        </Button>
                    </a>
                    <Button size="sm" className="gap-1.5" onClick={openModal}>
                        <PenLine className="size-3.5" />
                        Inscreva-se
                    </Button>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className={`md:hidden transition-colors cursor-pointer ${scrolled ? 'text-foreground' : 'text-white'}`}
                    aria-label="Menu"
                >
                    {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="border-t border-primary/10 bg-white/95 backdrop-blur-xl md:hidden animate-fade-in-up">
                    <div className="flex flex-col gap-2 p-4">
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button size="lg" className="mt-2 w-full gap-2" onClick={() => { setMobileOpen(false); openModal() }}>
                            <PenLine className="size-4" />
                            Inscreva-se →
                        </Button>
                        <a href="/avaliacao" className="block mt-2">
                            <Button variant="outline" size="lg" className="w-full gap-2 border-accent/50 text-accent hover:bg-accent/10">
                                <Star className="size-4" />
                                Avaliar Evento ⭐
                            </Button>
                        </a>
                        <a href="/admin" className="block mt-2">
                            <Button variant="outline" size="lg" className="w-full gap-2 text-muted-foreground">
                                <Lock className="size-4" />
                                Área Administrativa
                            </Button>
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}
