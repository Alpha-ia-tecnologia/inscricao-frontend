import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Schedule } from '@/components/Schedule'
import { RegistrationCTA, RegistrationModal } from '@/components/RegistrationForm'
import { AvaliacaoCTA } from '@/components/AvaliacaoCTA'
import { Footer } from '@/components/Footer'
import { RegistrationModalProvider } from '@/hooks/use-registration-modal'

export function LandingPage() {
    return (
        <RegistrationModalProvider>
            <Navbar />
            <Hero />
            <About />
            <Schedule />
            <RegistrationCTA />
            <AvaliacaoCTA />
            <Footer />
            {/* Global modal overlay */}
            <RegistrationModal />
        </RegistrationModalProvider>
    )
}
