export type Solicitacao = {
  id: number;
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  cod_cobranca: string;
  nome_cobranca: string;
  cod_cliente: string;
  rca: string;
  motivo_devolucao: string;
  vale?: string;
  tipo_devolucao: string;
  status: string;
  created_at: string;
  // No payload de listagem, evitamos enviar os BLOBs; usamos flags de existência
  has_arquivo_nf?: boolean;
  has_arquivo_nf_devolucao?: boolean;
  has_arquivo_recibo?: boolean;
  // Em detalhes (quando necessário), os campos abaixo podem ser presentes via outra rota
  arquivo_nf?: string;
  arquivo_nf_devolucao?: string;
  arquivo_recibo?: string;
  products_list: JSON;
  motivo_recusa: string;
  pendente_by: string;
  aprovada_by: string;
  aprovada_at: string;
  recusada_by: string;
  recusada_at: string;
  desdobrada_at: string;
  desdobrada_by: string;
  abatida_at: string;
  abatida_by: string;
  finalizada_at: string;
  finalizada_by: string;
};

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  user_level: string;
}

export interface SelectedFiles {
  nfDevolucao: File | null;
  recibo: File | null;
}

export interface SortColumn {
  column: string;
  direction: "asc" | "desc";
}
