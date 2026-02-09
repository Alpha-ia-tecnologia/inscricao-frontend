const API_URL = 'http://localhost:3001/api'

function getToken(): string | null {
    return localStorage.getItem('admin_token')
}

function authHeaders(): HeadersInit {
    const token = getToken()
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

// ── Public ──

export async function submitRegistration(data: {
    nome: string; cpf: string; email: string; telefone: string; instituicao: string; cargo: string
}) {
    const res = await fetch(`${API_URL}/inscricoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro ao realizar inscrição')
    return json
}

// ── Auth ──

export async function adminLogin(email: string, senha: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro ao fazer login')
    localStorage.setItem('admin_token', json.token)
    return json
}

export function adminLogout() {
    localStorage.removeItem('admin_token')
}

export function isAuthenticated(): boolean {
    return !!getToken()
}

// ── Admin: Inscricoes ──

export async function fetchInscricoes() {
    const res = await fetch(`${API_URL}/inscricoes`, { headers: authHeaders() })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    return res.json()
}

export async function fetchStats() {
    const res = await fetch(`${API_URL}/inscricoes/stats`, { headers: authHeaders() })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    return res.json()
}

export async function togglePresenca(id: number) {
    const res = await fetch(`${API_URL}/inscricoes/${id}/presenca`, {
        method: 'PATCH',
        headers: authHeaders(),
    })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    return res.json()
}

export function getExportCSVUrl(): string {
    return `${API_URL}/inscricoes/export`
}

// ── Admin: Certificados ──

export async function gerarCertificados() {
    const res = await fetch(`${API_URL}/certificados/gerar`, {
        method: 'POST',
        headers: authHeaders(),
    })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro ao gerar certificados')
    return json
}

export async function enviarCertificados() {
    const res = await fetch(`${API_URL}/certificados/enviar`, {
        method: 'POST',
        headers: authHeaders(),
    })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro ao enviar certificados')
    return json
}

export async function fetchCertificadosStats() {
    const res = await fetch(`${API_URL}/certificados/stats`, { headers: authHeaders() })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    return res.json()
}

// ── Settings ──

export async function fetchSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${API_URL}/settings`)
    return res.json()
}

export async function updateSettings(settings: Record<string, string>) {
    const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(settings),
    })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro ao atualizar configurações')
    return json
}

// ── Avaliações ──

export async function submitAvaliacao(data: {
    cpf: string
    nota_geral: number
    nota_conteudo: number
    nota_organizacao: number
    nota_palestrantes: number
    comentario?: string
    sugestoes?: string
}) {
    const res = await fetch(`${API_URL}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro ao enviar avaliação')
    return json
}

export async function fetchAvaliacoesStats() {
    const res = await fetch(`${API_URL}/avaliacoes/stats`, { headers: authHeaders() })
    if (res.status === 401) { adminLogout(); throw new Error('Sessão expirada') }
    return res.json()
}

export function getAvaliacoesExportUrl(): string {
    return `${API_URL}/avaliacoes/export`
}
