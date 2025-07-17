import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Definição do tipo para as solicitações
export type Solicitacao = {
  id: number;
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  codigo_cobranca: string;
  codigo_cliente: string;
  rca: string;
  motivo_devolucao: string;
  vale?: string;
  codigo_produto: string;
  tipo_devolucao: string;
  status: string;
  created_at: string;
};

// Função utilitária para carregar imagem base64 da public
export async function getLogoBase64(path = '/r3logo.png') {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function gerarRelatorioPDF({
  solicitacoes,
  status,
  filtroDescricao = '',
  titulo = 'R3 Suprimentos',
  subtitulo = 'Relatório de Solicitações',
  logoBase64,
}: {
  solicitacoes: Solicitacao[];
  status: string;
  filtroDescricao?: string;
  titulo?: string;
  subtitulo?: string;
  logoBase64?: string; // base64 opcional
}) {
  const doc = new jsPDF('l', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  // Logo
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 40, 20, 60, 60);
  }
  // Cabeçalho
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, 110, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const dataAtual = new Date().toLocaleString();
  doc.text(`${subtitulo} - ${dataAtual}`, 110, 60);
  doc.setFontSize(12);
  doc.text(`Filtro aplicado: ${status}${filtroDescricao ? ' - ' + filtroDescricao : ''}`, 110, 75);
  doc.text(`Total de itens: ${solicitacoes.length}`, 110, 90);
  // Tabela
  const tableData = solicitacoes.map(s => [
    s.id,
    s.nome,
    s.filial,
    s.numero_nf,
    s.carga,
    s.codigo_cobranca,
    s.codigo_cliente,
    s.rca,
    s.motivo_devolucao,
    s.vale || '',
    s.codigo_produto,
    s.tipo_devolucao,
    s.status,
    new Date(s.created_at).toLocaleDateString()
  ]);
  autoTable(doc, {
    startY: 110,
    head: [[
      'ID', 'Nome', 'Filial', 'Nº NF', 'Carga', 'Cód. Cobrança', 'Código Cliente', 'RCA', 'Motivo', 'Vale', 'Cód. Produto', 'Tipo', 'Status', 'Data'
    ]],
    body: tableData,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: 40, right: 40 },
    theme: 'grid',
    didDrawPage: (data) => {
      // Rodapé
      const str = `Página ${data.pageNumber} - Gerado em ${dataAtual}`;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(str, pageWidth - 40, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    }
  });
  doc.save(`relatorio-solicitacoes-${dataAtual.replace(/\D/g, '')}.pdf`);
}

export function gerarRelatorioXLSX({
  solicitacoes,
}: {
  solicitacoes: Solicitacao[];
}) {
  const wsData = [
    [
      'ID', 'Nome', 'Filial', 'Nº NF', 'Carga', 'Cód. Cobrança', 'Código Cliente', 'RCA', 'Motivo', 'Vale', 'Cód. Produto', 'Tipo', 'Status', 'Data'
    ],
    ...solicitacoes.map(s => [
      s.id,
      s.nome,
      s.filial,
      s.numero_nf,
      s.carga,
      s.codigo_cobranca,
      s.codigo_cliente,
      s.rca,
      s.motivo_devolucao,
      s.vale || '',
      s.codigo_produto,
      s.tipo_devolucao,
      s.status,
      new Date(s.created_at).toLocaleDateString()
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  // Estilizar cabeçalho
  if (ws['!ref']) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '2C3E50' } },
          alignment: { horizontal: 'center' }
        };
      }
    }
    // Filtros e congelar primeira linha
    ws['!autofilter'] = { ref: ws['!ref'] };
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  }
  // Largura automática
  ws['!cols'] = wsData[0].map((_, i) => {
    const maxLen = wsData.reduce((acc, row) => Math.max(acc, (row[i] ? row[i].toString().length : 0)), 10);
    return { wch: maxLen + 2 };
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  const dataAtual = new Date().toLocaleString().replace(/\D/g, '');
  XLSX.writeFile(wb, `Relatorio_Solicitacoes_${dataAtual}.xlsx`);
} 