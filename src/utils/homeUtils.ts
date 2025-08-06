export const getWelcomeMessage = (timeOfDay: 'morning' | 'afternoon' | 'evening') => {
  const messages = {
    morning: 'Bom dia! Que tal começar o dia verificando as solicitações pendentes?',
    afternoon: 'Boa tarde! Vamos dar uma olhada no progresso de hoje?',
    evening: 'Boa noite! Aqui está um resumo das atividades do dia.',
  };
  
  return messages[timeOfDay];
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const getRandomTip = () => {
  const tips = [
    {
      title: 'Dica de Produtividade',
      message: 'Use os filtros na página de solicitações para encontrar rapidamente o que você procura.',
      type: 'productivity'
    },
    {
      title: 'Lembrete Importante',
      message: 'Solicitações pendentes há mais de 24h aparecem destacadas na lista.',
      type: 'reminder'
    },
    {
      title: 'Funcionalidade',
      message: 'Você pode ordenar as colunas da tabela clicando nos cabeçalhos.',
      type: 'feature'
    },
    {
      title: 'Eficiência',
      message: 'Use as ações em lote para processar múltiplas solicitações de uma vez.',
      type: 'efficiency'
    },
    {
      title: 'Navegação',
      message: 'Use Ctrl+K para abrir a busca rápida em qualquer página.',
      type: 'navigation'
    }
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};

export const formatLastUpdate = () => {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
