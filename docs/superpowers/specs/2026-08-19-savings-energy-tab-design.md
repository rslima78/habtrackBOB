# Especificação Técnica: Aba "Cofre" (Barra de Energia e Economias Diárias)

## 1. Visão Geral
A funcionalidade adiciona uma nova aba chamada **"Cofre"** (ou Economias) no aplicativo Habtrack / Modo Monge. O objetivo é gamificar a economia financeira diária do usuário.
A economia diária é calculada como `(Limite Diário de Gastos - Total Gasto no Dia)`. Se o saldo for positivo, o valor alimenta uma **Barra de Energia** dividida em 10 células de R$ 100 cada (R$ 1.000 por bateria). Ao encher uma bateria, o usuário sobe de nível de bateria (Bateria 1, 2, 3...). Se o usuário estourar o orçamento, o valor excedente é debitado do saldo acumulado. Se o saldo ficar negativo, um alerta em destaque exibe *"Você está devendo R$ X,XX!"*.

## 2. Requisitos & Regras de Negócio

### 2.1. Cálculo de Economias Diárias
- Para cada dia do histórico com gastos registrados (ou a partir da data da conta):
  - `economia_dia = budgetDailyLimit - total_gasto_no_dia`
  - Se `total_gasto_no_dia <= budgetDailyLimit`: Economia positiva no dia.
  - Se `total_gasto_no_dia > budgetDailyLimit`: Prejuízo / estouro no dia (valor negativo).
- **Saldo Acumulado Total**: Soma de todas as economias diárias ao longo do tempo.

### 2.2. Barra de Energia (10 Células de R$ 100)
- Capacidade de cada bateria: R$ 1.000,00 (10 células de R$ 100,00 cada).
- `Nível da Bateria = Math.floor(saldoAcumulado / 1000) + 1` (para saldo >= 0).
- `Progresso no Nível Atual = saldoAcumulado % 1000`.
- Cada uma das 10 células:
  - Totalmente preenchida (100%) se `progresso >= (index + 1) * 100`.
  - Parcialmente preenchida (`(progresso - index * 100) % 100`) se a célula estiver sendo carregada.
  - Vazia se `progresso <= index * 100`.
- Visualização:
  - Cor esmeralda/verde neon brilhante para células preenchidas com efeitos de energia e faíscas.
  - Célula em carregamento com efeito pulsante de carga.

### 2.3. Topo Dinâmico & Alerta de Dívida
- **Saldo >= 0**:
  - Título / Badge: "Total Economizado: R$ XXX,XX".
  - Subtítulo: "⚡ Bateria Nível X (Y/10 Células Carregadas)".
- **Saldo < 0**:
  - Alerta vermelho de perigo / dano: "⚠️ Você está devendo R$ XXX,XX!".
  - Barra de energia em estado descarregada / alerta crítico.
  - Mensagem encorajadora para retomar o controle e reabastecer a energia.

### 2.4. Ações & Componentes da Tela
1. **Topo de Status & Saldo** (Positivo ou Alerta de Dívida).
2. **Barra de Energia Segmentada** (10 partes de R$ 100, indicador de nível de bateria).
3. **Card "Economia de Hoje"**:
   - Limite Diário atual vs. Gasto registrado hoje.
   - Saldo do dia com indicador visual (+ ou -).
   - Botão para **Ajuste Rápido do Limite Diário** (modal/input inline que atualiza `settings.budgetDailyLimit`).
4. **Histórico Dia a Dia**:
   - Lista cronológica decrescente dos dias com registros de gastos ou economia.
   - Mostra: Data, Gasto Total, Limite do Dia, Resultado (+R$ XX ou -R$ XX).

### 2.5. Navegação & Tema
- Nova aba no menu: `id: 'vault'`, `label: 'Cofre'`, `icon: Zap`, `emoji: '⚡'`.
- Presente na barra desktop superior e na barra mobile inferior.
- Design responsivo, moderno e imersivo alinhado ao tema escuro gamer do app.
