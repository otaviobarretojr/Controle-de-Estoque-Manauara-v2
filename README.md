# Controle de Estoque Manauara — base v2

Primeira base funcional fora do Work, criada para preservar a lógica do Controle de Estoque e acrescentar o módulo de Pré-vendas.

## Fontes suportadas
- **Inventário:** exportação `.xls` do Registro de Inventário (o arquivo é HTML internamente).
- **Pré-vendas:** CSV com as colunas `data, cliente, produto, capacidade, cor, consultor, valor_final, pre_registro, trade_in, ecossistema`.

## Regras implementadas
- Inventário e Pré-vendas são bases independentes.
- Nova importação de inventário não apaga Pré-vendas.
- Nova importação de Pré-vendas não altera inventário.
- Pré-vendas são consolidadas por modelo + capacidade + cor.
- Reconhecimento automático tolera variações como `Fold 8`/`Fold8` e `Roxo`/`Roxo Escuro`.
- Vínculo manual com item da aba Produtos fica persistido no navegador.
- Cálculo de estoque, saldo livre, déficit, cobertura e não vinculados.
- Déficit pode gerar Solicitação de Abastecimento com quantidade sugerida.
- Mesmo produto + mesma filial atualiza a solicitação existente, sem duplicar.
- Produtos podem ser desativados e permanecem assim após atualização da página.

## Persistência
Nesta primeira base, os dados ficam em `localStorage` do navegador. A próxima etapa recomendada é conectar a uma base online para sincronização real entre celular e computador.

## Execução
O projeto é estático. Abra `index.html` em um navegador moderno. Para uso publicado, hospede a pasta em um serviço de site estático.
