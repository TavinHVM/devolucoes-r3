import { NextResponse } from "next/server";
import db from "../../../lib/db";

export const fetchCache = "force-no-store";

export async function GET() {
  try {
    // Get recent financial solicitações (approved, abated, unfolded, finalized) ordered by latest status changes
    const recentActivities = await db.solicitacoes.findMany({
      select: {
        id: true,
        nome: true,
        numero_nf: true,
        status: true,
        created_at: true,
        updated_at: true,
        aprovada_at: true,
        recusada_at: true,
        desdobrada_at: true,
        reenviada_at: true,
        abatida_at: true,
        finalizada_at: true,
      },
      where: {
        status: {
          in: ["APROVADA", "ABATIDA", "DESDOBRADA", "FINALIZADA"],
        },
      },
      orderBy: {
        updated_at: "desc",
      },
      take: 10, // Get latest 10 activities
    });

    // Transform the data to include activity information
    const activities = recentActivities.map((solicitacao) => {
      let action = "";
      let type: "success" | "warning" | "info" = "info";
      let timestamp = solicitacao.updated_at || solicitacao.created_at;

      // Determine the most recent action based on timestamps
      const statusTimestamps = [
        {
          status: "aprovada",
          time: solicitacao.aprovada_at,
          action: "Solicitação aprovada",
          type: "success" as const,
        },
        {
          status: "abatida",
          time: solicitacao.abatida_at,
          action: "Solicitação abatida",
          type: "success" as const,
        },
        {
          status: "desdobrada",
          time: solicitacao.desdobrada_at,
          action: "Solicitação desdobrada",
          type: "info" as const,
        },
        {
          status: "finalizada",
          time: solicitacao.finalizada_at,
          action: "Solicitação finalizada",
          type: "success" as const,
        },
      ].filter((item) => item.time !== null);

      if (statusTimestamps.length > 0) {
        // Get the most recent status change
        const mostRecent = statusTimestamps.reduce((latest, current) =>
          new Date(current.time!) > new Date(latest.time!) ? current : latest
        );

        action = mostRecent.action;
        type = mostRecent.type;
        timestamp = new Date(mostRecent.time!);
      } else {
        // If no specific status changes, determine based on current status
        switch (solicitacao.status) {
          case "APROVADA":
            action = "Solicitação aprovada";
            type = "success";
            break;
          case "ABATIDA":
            action = "Solicitação abatida";
            type = "success";
            break;
          case "DESDOBRADA":
            action = "Solicitação desdobrada";
            type = "info";
            break;
          case "FINALIZADA":
            action = "Solicitação finalizada";
            type = "success";
            break;
          default:
            action = "Atividade financeira";
            type = "info";
        }
        timestamp = solicitacao.updated_at || solicitacao.created_at;
      }

      return {
        id: solicitacao.id,
        action,
        description: `Solicitação #${solicitacao.id} - NF ${solicitacao.numero_nf}`,
        time: timestamp,
        type,
        nome: solicitacao.nome,
        status: solicitacao.status,
      };
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Erro ao buscar atividades financeiras:", error);
    return NextResponse.json(
      { error: "Erro ao buscar atividades financeiras" },
      { status: 500 }
    );
  }
}
