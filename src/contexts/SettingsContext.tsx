import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchSettings } from '@/lib/api'

interface SettingsContextType {
    eventName: string
    eventDate: string
    eventLocation: string
    eventWorkload: string
    refreshSettings: () => Promise<void>
}

const defaults: SettingsContextType = {
    eventName: 'Jornada Pedagógica 2026',
    eventDate: '25 e 26 de Fevereiro de 2026',
    eventLocation: 'Centro de Convenções — Tuntum, MA',
    eventWorkload: '40',
    refreshSettings: async () => { },
}

const SettingsContext = createContext<SettingsContextType>(defaults)

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [eventName, setEventName] = useState(defaults.eventName)
    const [eventDate, setEventDate] = useState(defaults.eventDate)
    const [eventLocation, setEventLocation] = useState(defaults.eventLocation)
    const [eventWorkload, setEventWorkload] = useState(defaults.eventWorkload)

    const refreshSettings = async () => {
        try {
            const s = await fetchSettings()
            if (s.event_name) setEventName(s.event_name)
            if (s.event_date) setEventDate(s.event_date)
            if (s.event_location) setEventLocation(s.event_location)
            if (s.event_workload) setEventWorkload(s.event_workload)
        } catch (err) {
            console.error('Erro ao carregar configurações:', err)
        }
    }

    useEffect(() => {
        refreshSettings()
    }, [])

    return (
        <SettingsContext.Provider value={{ eventName, eventDate, eventLocation, eventWorkload, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    return useContext(SettingsContext)
}
