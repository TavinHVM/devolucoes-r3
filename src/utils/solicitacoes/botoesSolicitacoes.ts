export async function AprovarSolicitacao(id: number) {
    try {
        const response = await fetch(`/api/btnsSolicitacoes/aprovarSolicitacao/${id}`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
        });
        if (!response.ok) {
        throw new Error("Erro ao mudar Status da solicitação para Aprovada.");
        }
    } catch (error) {
        console.error("Erro ao mudar Status da solicitação para Aprovada:", error);
    }
}

export async function RecusarSolicitacao(id: number) {
    try {
        const response = await fetch(`/api/btnsSolicitacoes/recusarSolicitacao/${id}`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
        });
        if (!response.ok) {
        throw new Error("Erro ao mudar Status da solicitação para Recusada.");
        }
    } catch (error) {
        console.error("Erro ao mudar Status da solicitação para Recusada:", error);
    }
}

export async function DesdobrarSolicitacao(id: number) {
    try {
        const response = await fetch(`/api/btnsSolicitacoes/desdobrarSolicitacao/${id}`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
        });
        if (!response.ok) {
        throw new Error("Erro ao mudar Status da solicitação para Desdobrada.");
        }
    } catch (error) {
        console.error("Erro ao mudar Status da solicitação para Desdobrada:", error);
    }
}

export async function AbaterSolicitacao(id: number) {
    try {
        const response = await fetch(`/api/btnsSolicitacoes/abaterSolicitacao/${id}`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
        });
        if (!response.ok) {
        throw new Error("Erro ao mudar Status da solicitação para Abatida.");
        }
    } catch (error) {
        console.error("Erro ao mudar Status da solicitação para Abatida:", error);
    }
}

export async function FinalizarSolicitacao(id: number) {
    try {
        const response = await fetch(`/api/btnsSolicitacoes/finalizarSolicitacao/${id}`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
        });
        if (!response.ok) {
        throw new Error("Erro ao mudar Status da solicitação para Finalizada.");
        }
    } catch (error) {
        console.error("Erro ao mudar Status da solicitação para Finalizada:", error);
    }
}

export async function ReenviarSolicitacao(id: number) {
    try {
        const response = await fetch(`/api/btnsSolicitacoes/reenviarSolicitacao/${id}`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
        });
        if (!response.ok) {
        throw new Error("Erro ao mudar Status da solicitação para Reenviada.");
        }
    } catch (error) {
        console.error("Erro ao mudar Status da solicitação para Reenviada:", error);
    }
}
