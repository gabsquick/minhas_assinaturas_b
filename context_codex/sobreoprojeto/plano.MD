# Plano de implementação

## Objetivo e escopo

Construir a primeira entrega visual do Minhas Assinaturas para Android, usando a base Expo + TypeScript existente e dados simulados. O protótipo permitirá ajustar o design da lista de assinaturas, do resumo financeiro e da representação do cadastro antes de implementar funcionalidades reais.

Este plano não autoriza iniciar a implementação, instalar dependências ou publicar o aplicativo. A visão permanente do produto está em `sobre_o_projeto.MD`.

## 1. Definir a interface

**Objetivo:** confirmar a composição visual antes de detalhar sua execução.

**Entregas:**

- Definir paleta, tipografia, espaçamento e aparência dos itens da lista.
- Definir a posição do resumo na tela inicial, conforme a preferência do usuário por uma área no meio ou na parte inferior do conteúdo.
- Mostrar nome, logo, valor cobrado, ciclo e data de vencimento ou renovação de cada assinatura.
- Apresentar a quantidade de assinaturas e o total equivalente mensal, identificando esse total de forma clara.
- Definir como representar o cadastro com nome livre, valor editável, data e campo “modelo de assinatura”.
- Representar o seletor com as opções mensal, trimestral e anual.

**Dependências:** escolhas visuais do usuário. Não há documento detalhado de design no contexto atual; recomenda-se definir a UI antes de implementar as telas. O formato do cadastro — tela, modal ou outra composição — permanece a decidir.

**Critério de conclusão:** composição e limites de interação do protótipo confirmados pelo usuário, sem assumir uma direção visual ainda não escolhida.

## 2. Preparar a base do protótipo

**Objetivo:** organizar o mínimo necessário para implementar o design aprovado.

**Entregas:**

- Manter Expo SDK 57, React Native e TypeScript, respeitando a compatibilidade com Expo Go no Android.
- Separar dados demonstrativos, componentes e estilos com nomes claros em português.
- Adotar Expo Router caso as telas aprovadas exijam navegação, seguindo a organização em `src/app/` prevista nas instruções do projeto.
- Consultar a documentação correspondente ao SDK antes de usar APIs ou escolher dependências durante a implementação.

**Dependência:** interface definida na etapa 1. Não incluir camada de backend ou armazenamento nesta entrega.

**Critério de conclusão:** estrutura proporcional ao protótipo, sem abstrações desnecessárias e sem funcionalidade real de gerenciamento de assinaturas.

## 3. Implementar a tela inicial com dados simulados

**Objetivo:** tornar a apresentação central do produto visível para revisão.

**Entregas:**

- Montar a lista com serviços demonstrativos, incluindo Netflix e Spotify.
- Usar valores fictícios, datas e exemplos dos três ciclos de cobrança, sem apresentá-los como preços oficiais.
- Usar logos locais dos serviços escolhidos após definir sua fonte; decidir com o usuário a representação de serviços desconhecidos.
- Exibir a quantidade e o total mensal coerentes com os dados simulados, sem botão de cálculo.
- Considerar rolagem, áreas seguras do Android e legibilidade de nomes e valores em telas menores.

**Regra do resumo:** dividir o valor de cada assinatura por 1, 3, 4 ou 12 meses, conforme seu ciclo, e somar os equivalentes mensais. O valor cobrado na renovação deve continuar identificável em cada item.

**Critério de conclusão:** tela inicial fiel ao design aprovado e resumo consistente com os exemplos exibidos.

## 4. Representar o cadastro e ajustar o visual

**Objetivo:** permitir revisar a aparência do cadastro e do dropdown.

**Entregas:** implementar a composição aprovada com campos e estados demonstrativos, incluindo uma representação do menu aberto. Qualquer interação de apresentação deve respeitar os limites confirmados na etapa 1. Cadastro persistente, edição real e exclusão não pertencem a esta entrega.

**Critério de conclusão:** telas e estados visuais disponíveis para o usuário avaliar e solicitar ajustes, sem ampliar o protótipo para um aplicativo funcional.

## Conferência pelo usuário

O usuário fará a conferência no Expo Go em seu emulador Android, iniciando o projeto com `npm start`. Avaliar a lista, as logos, a legibilidade, a rolagem, o posicionamento do resumo e a representação do dropdown.

Para conferir os exemplos financeiros, uma assinatura anual de R$ 120 deve representar R$ 10 mensais; e uma trimestral de R$ 90, R$ 30 mensais. A quantidade deve corresponder aos itens exibidos.

Não executar testes, lint, typecheck ou validações automáticas por iniciativa própria. A conferência fica com o usuário, salvo pedido explícito para testar.

## Evolução funcional futura

Após aprovação do design e autorização específica, planejar cadastro, edição, exclusão e persistência local. Nessa fase, definir a tecnologia de armazenamento, o reconhecimento de nomes para associar logos e o catálogo opcional de planos predefinidos, sempre permitindo alterar valores e datas.

O resumo deverá então atualizar automaticamente conforme as assinaturas forem alteradas. O produto continuará sem login, backend ou sincronização. Notificações, pagamentos e integrações com os serviços não fazem parte do escopo confirmado.
