import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminParticipants } from '@/pages/admin/AdminParticipants'
import { AdminCertificates } from '@/pages/admin/AdminCertificates'
import { AdminSettings } from '@/pages/admin/AdminSettings'
import { AdminAvaliacoes } from '@/pages/admin/AdminAvaliacoes'
import { AdminUsers } from '@/pages/admin/AdminUsers'
import { AvaliacaoPage } from '@/pages/AvaliacaoPage'
import { SettingsProvider } from '@/contexts/SettingsContext'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/avaliacao',
    element: <AvaliacaoPage />,
  },
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'participantes',
        element: <AdminParticipants />,
      },
      {
        path: 'certificados',
        element: <AdminCertificates />,
      },
      {
        path: 'configuracoes',
        element: <AdminSettings />,
      },
      {
        path: 'avaliacoes',
        element: <AdminAvaliacoes />,
      },
      {
        path: 'usuarios',
        element: <AdminUsers />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  </StrictMode>,
)
