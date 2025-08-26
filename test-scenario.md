 # Cenário de Teste - Controle de Devoluções

## Objetivo
Testar se o sistema impede corretamente a devolução de produtos que já foram devolvidos anteriormente.

## Cenário de Teste

### Produto de Exemplo
- **Código**: 123
- **Descrição**: Caneta Azul
- **Quantidade Original na NF**: 30 unidades
- **Preço Unitário**: R$ 2,50

### Passo 1: Primeira Devolução
1. Criar solicitação para NF 1234
2. Devolver 10 canetas (código 123)
3. Finalizar e aprovar a solicitação

### Passo 2: Segunda Devolução (Teste)
1. Criar nova solicitação para a mesma NF 1234
2. Tentar devolver 30 canetas novamente
3. **Resultado Esperado**: Sistema deve permitir no máximo 20 canetas (30 - 10 já devolvidas)
4. **UI Esperada**: 
   - Coluna "Já Devolvido" deve mostrar "10"
   - Botões +/- devem respeitar o limite de 20
   - Campo input deve limitar em 20
   - Botão "Devolver Tudo" deve selecionar apenas 20

### Validações
- ✅ Múltiplas solicitações para mesma NF permitidas
- ✅ Cálculo correto de quantidades já devolvidas
- ✅ Limitação nas funções de quantidade
- ✅ UI mostra informações corretas
- ✅ Mensagens de aviso apropriadas

### Implementação
- API `produtosDevolvidos` retorna produtos já devolvidos por NF
- Hook `useSolicitacaoForm` possui função `getQuantidadeDisponivel`
- Todas as funções de quantidade usam esta função central
- UI atualizada para mostrar quantidades já devolvidas
