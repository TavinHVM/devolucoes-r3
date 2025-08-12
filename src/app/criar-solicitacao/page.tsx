"use client";

import Header from "../../components/header";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreateSolicitacaoRoute from "../../components/CreateSolicitacaoRoute";
import {
  PageHeader,
  ProgressIndicator,
  InfoFormStep,
  ProductSelectionStep,
  useSolicitacaoForm,
} from "../../components/criar-solicitacao";

export default function Solicitacao() {
  return (
    <ProtectedRoute>
      <CreateSolicitacaoRoute>
        <SolicitacaoContent />
      </CreateSolicitacaoRoute>
    </ProtectedRoute>
  );
}

function SolicitacaoContent() {
  const {
    // Estados
    currentStep,
    numeroNF,
    setNumeroNF,
    nomeClient,
    numeroCodigoCliente,
    numeroCarga,
    codigoRca,
    codigoFilial,
    numeroCodigoCobranca,
    nomeCodigoCobranca,
    identificador,
    setArquivoNF,
    tipoDevolucao,
    produtos,
    quantidadesDevolucao,
    setQuantidadesDevolucao,
    todosSelecionados,
    form,
    
    // Funções
    checkIdentificador,
    isButtonEnabled,
    avancarPagina,
    voltarPagina,
    aumentarQuantidade,
    diminuirQuantidade,
    alterarQuantidadeInput,
    devolverTudo,
    alternarSelecaoTodos,
    finalizarSolicitacao,
    handleStepChange,
  } = useSolicitacaoForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <PageHeader />

        <ProgressIndicator
          currentStep={currentStep}
          onStepChange={handleStepChange}
          canAdvanceToStep2={!!(numeroNF && numeroNF.length === 6)}
        />

        {/* Etapa 1: Informações da NF */}
        {currentStep === 1 && (
          <InfoFormStep
            form={form}
            numeroNF={numeroNF}
            setNumeroNF={setNumeroNF}
            nomeClient={nomeClient}
            numeroCodigoCliente={numeroCodigoCliente}
            numeroCarga={numeroCarga}
            codigoRca={codigoRca}
            codigoFilial={codigoFilial}
            numeroCodigoCobranca={numeroCodigoCobranca}
            nomeCodigoCobranca={nomeCodigoCobranca}
            identificador={identificador}
            setArquivoNF={setArquivoNF}
            onAdvance={avancarPagina}
            checkIdentificador={checkIdentificador}
            isButtonEnabled={isButtonEnabled}
          />
        )}

        {/* Etapa 2: Seleção de Produtos */}
        {currentStep === 2 && (
          <ProductSelectionStep
            numeroNF={numeroNF}
            nomeClient={nomeClient}
            tipoDevolucao={tipoDevolucao}
            produtos={produtos}
            quantidadesDevolucao={quantidadesDevolucao}
            todosSelecionados={todosSelecionados}
            aumentarQuantidade={aumentarQuantidade}
            diminuirQuantidade={diminuirQuantidade}
            alterarQuantidadeInput={alterarQuantidadeInput}
            devolverTudo={devolverTudo}
            setQuantidadesDevolucao={setQuantidadesDevolucao}
            alternarSelecaoTodos={alternarSelecaoTodos}
            onBack={voltarPagina}
            onFinalize={finalizarSolicitacao}
          />
        )}
      </div>
    </div>
  );
}
