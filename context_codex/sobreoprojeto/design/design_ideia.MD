# Ideia de design da interface

## Telas e limites da proposta

Proposta futura para duas telas do Minhas Assinaturas: **Home** e **cadastro de assinatura em tela separada**. A interface atual continua sendo o template inicial. O contexto do produto está em [sobre_o_projeto.MD](../sobre_o_projeto.MD).

A primeira entrega será visual, com dados simulados. Os estados descritos orientam a apresentação do protótipo; não autorizam cadastro persistente, edição real, armazenamento ou integrações. A composição poderá ser ajustada após o usuário vê-la no aparelho.

## Direção visual e referências

Referência fornecida: imagem com três telas de aplicativo financeiro, fundo escuro, cards, botões e superfícies com cantos arredondados, além de blocos de cor com contraste forte. Usar essas características como inspiração para o gerenciamento de assinaturas. A imagem não estabelece medidas exatas nem exige reprodução fiel.

Preferências confirmadas: fundo escuro, azul claro e verde claro, cards individuais e quadrados com cantos arredondados. Vermelho pode ser usado para algo negativo, se necessário. Não há estado negativo obrigatório nesta primeira composição.

## Composição e hierarquia por tela

### Home

**Finalidade:** visualizar o gasto recorrente e as assinaturas em uma única tela. **Ação principal:** abrir o cadastro pelo botão “+”.

Composição de cima para baixo:

1. Cabeçalho com identificação do aplicativo à esquerda e botão “+” à direita. O botão terá contorno ou superfície quadrada com cantos arredondados e símbolo azul claro. O acabamento da superfície é uma sugestão; o formato e a cor do símbolo estão confirmados.
2. Card principal, antes de qualquer assinatura, com o total equivalente mensal como informação de maior destaque. Um rótulo menor explica o valor, e a quantidade de assinaturas aparece como informação secundária no mesmo card.
3. Identificação da seção de assinaturas, seguida de cards individuais empilhados verticalmente.

Cada card de assinatura terá um quadrado arredondado com logo à esquerda; nome e data de renovação no centro; valor cobrado e ciclo de cobrança à direita. Essa distribuição interna é uma proposta para manter os itens legíveis. Em nomes extensos ou telas estreitas, o conteúdo pode ocupar mais linhas sem sobrepor o valor.

O valor de cada card representa a cobrança do ciclo original. O total principal representa o equivalente mensal da soma. Os rótulos devem comunicar essa diferença, especialmente em assinaturas anuais e trimestrais.

**Comportamento visual proposto:** cabeçalho fixo; card principal e lista roláveis juntos. Assim, o total aparece antes da lista ao abrir a Home e os cards seguintes continuam acessíveis por rolagem. Esse comportamento ainda não foi confirmado pelo usuário.

### Cadastro de assinatura

**Finalidade:** representar o cadastro de uma assinatura. **Ação principal proposta:** “Salvar assinatura”.

Composição de cima para baixo:

1. Cabeçalho com ação de voltar à esquerda e identificação do cadastro.
2. Prévia do serviço em um quadrado com cantos arredondados, acima dos campos.
3. Campo de nome livre do serviço.
4. Campo de valor da cobrança.
5. Campo “Modelo de assinatura”, com indicação de abertura do dropdown.
6. Campo de data de renovação.
7. Botão principal “Salvar assinatura”, abaixo do formulário, na região inferior quando houver espaço.

Ao informar Netflix ou Spotify, a prévia deverá mostrar a logo correspondente. Um nome desconhecido, como IG4U, deverá mostrar um **ponto de interrogação “?”**. O nome continua livre; o ícone genérico não representa erro e não deve receber tratamento vermelho.

O seletor abre um modal inferior e oferece **Mensal, Trimestral e Anual**. A opção atual deve ter indicação clara de seleção. No protótipo, representar os estados necessários com dados simulados, conforme a interação visual que vier a ser autorizada.

**Comportamento visual proposto:** cabeçalho fixo e formulário rolável. O botão acompanha o conteúdo, podendo ser alcançado com o teclado aberto. A forma de selecionar a data ainda está em aberto.

## Cores, tipografia e espaçamentos

As cores abaixo são sugestões de execução, não valores extraídos da referência ou já aprovados:

- Fundo: grafite próximo de `#111714`.
- Cards e campos: superfície escura próxima de `#202824`.
- Texto principal: branco suave próximo de `#F3F6F4`.
- Texto secundário: cinza claro próximo de `#AAB8B0`.
- Azul claro: próximo de `#75CFFF`, confirmado como cor do símbolo “+”; sugerido também para foco e seleção.
- Verde claro: próximo de `#B9E6C5`, sugerido para o destaque do total e o botão de salvar. A aplicação exata do verde permanece em aberto.

Propor tipografia sem serifa, com valor total grande e semibold, nomes dos serviços em peso médio e datas/ciclos menores. A fonte ainda não está definida.

Como ponto de partida, sugerir margens laterais de 20, espaços de 12 entre cards, preenchimento de 16 a 20 e cantos de 16 a 24 em unidades de layout. Essas medidas são propostas ajustáveis; o requisito confirmado é o uso de cantos arredondados. Manter superfícies simples e contraste por cor, sem depender de efeitos decorativos.

## Componentes, ícones e recursos visuais

- Cards individuais com a mesma linguagem do card principal, preservando a maior hierarquia deste último.
- Logos reconhecíveis de Netflix e Spotify, com proporção preservada e centralizadas nos quadrados arredondados.
- “?” centralizado para qualquer serviço desconhecido.
- Ícones simples para voltar e abrir o dropdown.
- Botão “+” com área de toque confortável, sem reduzir sua área interativa ao tamanho do símbolo.

A fonte dos arquivos das logos ainda precisa ser definida. As cores próprias das marcas podem aparecer nas logos sem alterar a paleta geral do aplicativo.

## Conteúdo e textos obrigatórios

Conteúdo confirmado: total mensal, quantidade de assinaturas, nome de cada serviço, valor, ciclo, data, símbolo “+”, ícone “?” e as três opções de cobrança.

Textos sugeridos em português: “Minhas Assinaturas”, “Total mensal”, “Assinaturas”, “Nova assinatura”, “Nome do serviço”, “Valor”, “Modelo de assinatura”, “Data de renovação” e “Salvar assinatura”. A redação exata poderá ser refinada. Para a quantidade, ajustar singular e plural, por exemplo “1 assinatura” ou “4 assinaturas”.

Usar valores e datas demonstrativos coerentes, sem tratar exemplos como preços oficiais dos serviços.

## Estados e feedback visual

Representar a Home preenchida, cadastro com serviço reconhecido, cadastro com serviço desconhecido e dropdown aberto com uma opção selecionada. A identificação de serviço desconhecido é neutra e permite manter o nome digitado.

Foco de campo e seleção podem usar azul claro. Estados de erro, sucesso e lista vazia não foram detalhados; não adicionar mensagens ou fluxos novos por conta própria. Animações também não estão definidas.

## Adaptação e acessibilidade

Na execução futura, respeitar as áreas seguras do Android no cabeçalho e na região inferior. Permitir rolagem em telas pequenas e com teclado aberto, preservar valores legíveis com texto ampliado e evitar alturas rígidas que cortem nomes ou rótulos.

Propor áreas interativas de pelo menos 48 unidades de layout. Nomear a ação do botão “+” como adicionar assinatura para leitores de tela. Não usar somente cor para identificar a seleção do ciclo. O contraste e a acessibilidade ainda deverão ser conferidos; não estão verificados.

## Pontos para conferir o resultado visual

- Card principal aparece antes das assinaturas e destaca o total sobre a quantidade.
- Cards individuais mantêm alinhamento, espaçamento e hierarquia consistentes.
- Símbolo “+” é azul claro e está dentro de um quadrado arredondado.
- Logos e “?” têm escala equilibrada e não ficam distorcidos.
- Prévia do cadastro corresponde ao nome do serviço representado.
- Valor cobrado e total mensal equivalente têm significados claros.
- Seletor mostra os três ciclos e uma seleção identificável.
- Cabeçalhos, formulário e cards permanecem legíveis nas áreas seguras e em telas menores.

Esses pontos orientam a conferência futura pelo usuário no emulador; nenhuma validação visual ou teste foi realizado nesta etapa.

## Preferências confirmadas e escolhas em aberto

**Confirmado:** duas telas, cadastro separado, fundo escuro, azul e verde claros, total e quantidade em um card principal antes da lista, cards individuais, “+” azul claro em quadrado arredondado, logos por serviço conhecido e “?” para desconhecidos.

**Em aberto ou sugerido:** tons exatos, fonte, medidas, uso do verde no total e no botão, redação final dos rótulos, comportamento fixo/rolável, seletor de data, origem das logos e limites das interações demonstrativas. Ajustes de composição podem ser feitos após a revisão visual do usuário.
