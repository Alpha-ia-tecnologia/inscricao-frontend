import { Mail } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-border bg-card py-10">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    {/* Left: SEMED logo */}
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-semed.png" alt="SEMED / Prefeitura de Tuntum" className="h-14 w-auto" />
                    </div>

                    {/* Center: Instituto Gestar */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3">
                            <img src="/images/logo-gestar.jpeg" alt="Instituto Gestar" className="h-14 w-auto rounded" />
                            <div>
                                <p className="text-sm font-semibold text-primary">
                                    Organização: INSTITUTO GESTAR
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                                    <Mail className="size-3" />
                                    institutogestar@instituto.gestarr
                                </p>
                            </div>
                        </div>
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
