export interface Produto {
  codprod: string;
  descricao: string;
  qt: number;
  punit: number;
}

export interface InfosNF {
  codcli: string;
  numcar: string;
  codusur: string;
  codcob: string;
  cobranca: string;
  cliente: string;
  codfilial: string;
  cgcent: string;
}

export interface ProdutoFormatado {
  codigo: string;
  descricao: string;
  quantidade: string;
  punit: string;
}

export async function fetchProdutosNF(numnota: string): Promise<Produto[]> {
  try {
    console.log("Fazendo requisição para:", `/api/getProdutosNF/${numnota}`);
    const res = await fetch(`/api/getProdutosNF/${numnota}`);
    console.log("Status da resposta:", res.status);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Dados recebidos da API:", data);

    return data.produtos || [];
  } catch (error) {
    console.error("Erro na função fetchProdutosNF:", error);
    return [];
  }
}

export async function fetchInfosNF(numnota: string): Promise<InfosNF | null> {
  const res = await fetch(`/api/getInfosNF/${numnota}`);
  if (!res.ok) {
    console.error("Erro na requisição:", res.status, res.statusText);
    return null;
  }
  const data = await res.json();
  return data;
}

export function checkIdentificador(identificador: string): string {
  const cleaned = identificador.replace(/\D/g, "");

  if (cleaned.length > 11) {
    // Formata como CNPJ: 00.000.000/0000-00
    return cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  } else {
    // Formata como CPF: 000.000.000-00
    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
}

export function formatProdutos(produtosNF: Produto[]): ProdutoFormatado[] {
  return produtosNF.map((produto) => ({
    codigo: produto.codprod,
    descricao: produto.descricao,
    quantidade: produto.qt.toString(),
    punit: produto.punit.toString(),
  }));
}
