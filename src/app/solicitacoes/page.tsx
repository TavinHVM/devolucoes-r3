"use client";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPermissions, UserPermissions } from "@/utils/permissions/userPermissions";
import { useSolicitacoes } from "@/hooks/useSolicitacoes";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  StatsCards,
  FiltersControls,
  SolicitacoesTable,
  PageHeader,
} from "@/components/solicitacoes";

export default function VisualizacaoSolicitacoes() {
  return (
    <ProtectedRoute>
      <SolicitacoesContent />
    </ProtectedRoute>
  );
}

function SolicitacoesContent() {
  // Authentication and permissions
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({
    canAprovar: false,
    canRecusar: false,
    canDesdobrar: false,
    canAbater: false,
    canFinalizar: false,
    canDelete: false,
  });

  // Custom hook for all solicitações logic
  const {
    solicitacoes,
    currentItems,
    finalSolicitacoes,
    status,
    setStatus,
    busca,
    setBusca,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
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

  // Load user permissions
  useEffect(() => {
    const loadPermissions = async () => {
      if (user) {
        const permissions = await getUserPermissions(user);
        setUserPermissions(permissions);
      }
    };
    loadPermissions();
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

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
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refreshing={refreshing}
          onRefresh={fetchSolicitacoes}
          filteredSolicitacoes={finalSolicitacoes}
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
          onRefreshList={fetchSolicitacoes}
          userPermissions={userPermissions}
        />
      </div>
    </div>
  );
}
