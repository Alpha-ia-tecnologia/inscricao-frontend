import { createContext, useContext, useState, type ReactNode } from 'react'

interface ModalContextType {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType>({
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
})

export function useRegistrationModal() {
    return useContext(ModalContext)
}

export function RegistrationModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    function openModal() {
        setIsOpen(true)
        document.body.style.overflow = 'hidden'
    }

    function closeModal() {
        setIsOpen(false)
        document.body.style.overflow = ''
    }

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}
