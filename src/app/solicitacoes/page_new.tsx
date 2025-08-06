"use client";
import { useEffect } from "react";
import Header from "../../components/header";
import { useAuth } from "@/lib/useAuth";
import { getUserPermissions } from "@/utils/permissions/userPermissions";
import { useSolicitacoes } from "@/hooks/useSolicitacoes";
import {
  StatsCards,
  FiltersControls,
  SolicitacoesTable,
  PageHeader,
} from "@/components/solicitacoes";

export default function VisualizacaoSolicitacoes() {
  // Authentication and permissions
  const { user, isAuthenticated, isLoading } = useAuth();
  const userPermissions = getUserPermissions(user);

  // Custom hook for all solicitações logic
  const {
    solicitacoes,
    currentItems,
    finalSolicitacoes,
    status,
    setStatus,
    busca,
    setBusca,
    currentPage,
    setCurrentPage,
    totalPages,
    startPage,
    endPage,
    sortColumns,
    handleSort,
    handleClearSort,
    refreshing,
    fetchSolicitacoes,
  } = useSolicitacoes();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <PageHeader />

        {/* Stats Cards */}
        <StatsCards solicitacoes={solicitacoes} />

        {/* Controls Section */}
        <FiltersControls
          busca={busca}
          setBusca={setBusca}
          status={status}
          setStatus={setStatus}
          refreshing={refreshing}
          onRefresh={fetchSolicitacoes}
        />

        {/* Main Table */}
        <SolicitacoesTable
          currentItems={currentItems}
          totalSolicitacoes={solicitacoes.length}
          filteredCount={finalSolicitacoes.length}
          currentPage={currentPage}
          totalPages={totalPages}
          startPage={startPage}
          endPage={endPage}
          sortColumns={sortColumns}
          onSort={handleSort}
          onClearSort={handleClearSort}
          onPageChange={setCurrentPage}
          userPermissions={userPermissions}
        />
      </div>
    </div>
  );
}
