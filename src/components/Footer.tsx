import { Leaf, Mail } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'

export function Footer() {
    const { eventName } = useSettings()
    return (
        <footer className="border-t border-border bg-card py-10">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    {/* Left: SEMED logo */}
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-semed.png" alt="SEMED / Prefeitura de Tuntum" className="h-14 w-auto" />
                    </div>

                    {/* Center: event */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground flex items-center gap-1.5 justify-center">
                            <Leaf className="size-3.5 text-primary" />
                            {eventName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            CT Centro de Treinamento Esportivo — Tuntum, MA
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                            <Mail className="size-3" />
                            institutogestar@instituto.gestarr
                        </p>
                    </div>

                    {/* Right: copyright */}
                    <p className="text-xs text-muted-foreground text-center sm:text-right">
                        © 2026 SEMED Tuntum.<br />
                        Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}
