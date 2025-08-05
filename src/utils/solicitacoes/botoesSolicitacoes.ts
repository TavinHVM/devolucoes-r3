export async function AprovarSolicitacao(
  id: number,
  nfDevolucao?: File,
  recibo?: File
) {
  try {
    const formData = new FormData();

    if (nfDevolucao) {
      formData.append("arquivo_nf_devolucao", nfDevolucao);
    }

    if (recibo) {
      formData.append("arquivo_recibo", recibo);
    }

    const response = await fetch(
      `/api/btnsSolicitacoes/aprovarSolicitacao/${id}`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      const errorMessage =
        (data && typeof data.error === "string" && data.error) ||
        "Erro ao mudar Status da solicitação para Aprovada.";

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message); // Aqui você pode exibir com toast.error(error.message)
    } else {
      console.error(
        "Erro inesperado ao mudar Status da solicitação para Aprovada."
      );
    }
  }
}

export async function RecusarSolicitacao(id: number, motivo_recusa: string) {
  try {
    const response = await fetch(
      `/api/btnsSolicitacoes/recusarSolicitacao/${id}`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ motivo_recusa }),
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao mudar Status da solicitação para Recusada.");
    }
  } catch (error) {
    console.error("Erro ao mudar Status da solicitação para Recusada:", error);
  }
}

export async function DesdobrarSolicitacao(id: number) {
  try {
    const response = await fetch(
      `/api/btnsSolicitacoes/desdobrarSolicitacao/${id}`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao mudar Status da solicitação para Desdobrada.");
    }
  } catch (error) {
    console.error(
      "Erro ao mudar Status da solicitação para Desdobrada:",
      error
    );
  }
}

export async function AbaterSolicitacao(id: number) {
  try {
    const response = await fetch(
      `/api/btnsSolicitacoes/abaterSolicitacao/${id}`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao mudar Status da solicitação para Abatida.");
    }
  } catch (error) {
    console.error("Erro ao mudar Status da solicitação para Abatida:", error);
  }
}

export async function FinalizarSolicitacao(id: number) {
  try {
    const response = await fetch(
      `/api/btnsSolicitacoes/finalizarSolicitacao/${id}`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao mudar Status da solicitação para Finalizada.");
    }
  } catch (error) {
    console.error(
      "Erro ao mudar Status da solicitação para Finalizada:",
      error
    );
  }
}

export async function ReenviarSolicitacao(id: number) {
  try {
    const response = await fetch(
      `/api/btnsSolicitacoes/reenviarSolicitacao/${id}`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        // cache: 'no-store',
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao mudar Status da solicitação para Reenviada.");
    }
  } catch (error) {
    console.error("Erro ao mudar Status da solicitação para Reenviada:", error);
  }
}
