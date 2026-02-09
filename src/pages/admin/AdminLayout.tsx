import { useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { adminLogout, isAuthenticated } from '@/lib/api'
import {
    LayoutDashboard,
    Users,
    Award,
    Settings,
    LogOut,
    Leaf,
    ChevronLeft,
    ChevronRight,
    Star,
} from 'lucide-react'
import { useEffect } from 'react'

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/participantes', label: 'Participantes', icon: Users },
    { path: '/admin/certificados', label: 'Certificados', icon: Award },
    { path: '/admin/avaliacoes', label: 'Avaliações', icon: Star },
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    // Protect: redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/admin')
        }
    }, [navigate])

    function handleLogout() {
        adminLogout()
        navigate('/admin')
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside
                className={`flex flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl transition-all duration-300 fixed inset-y-0 z-20 ${collapsed ? 'w-20' : 'w-72'
                    }`}
            >
                {/* Logo */}
                <div className={`flex h-20 items-center gap-4 border-b border-border/60 px-6 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20">
                        <Leaf className="size-5" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <div className="font-display font-bold text-lg text-foreground truncate">SEMED</div>
                            <div className="text-xs font-medium text-muted-foreground truncate tracking-wide">PAINEL ADM</div>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 space-y-2 p-4 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    } ${collapsed ? 'justify-center px-2' : ''}`}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon className={`size-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="border-t border-border/60 p-4 space-y-2 bg-background/50">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}
                    >
                        {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
                        {!collapsed && <span>Recolher Menu</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer group ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="size-5 shrink-0 transition-transform group-hover:-translate-x-1" />
                        {!collapsed && <span>Sair do Sistema</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-72'}`}>
                <div className="h-full p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
