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
  arquivo_nf?: string;
  arquivo_nf_devolucao?: string;
  arquivo_recibo?: string;
  products_list: JSON;
  motivo_recusa: string;
};

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
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
