export default async function AprovarSolicitacao(id: number) {
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
