# Sobre o projeto

## Identidade

**Minhas Assinaturas** é um aplicativo de gerenciamento de assinaturas pessoais, com foco em Android. O nome do pacote npm é `minhas-assinaturas`.

O público são pessoas que mantêm assinaturas de serviços e querem visualizar, em um único lugar, quantas possuem, quanto gastam e quando ocorre o vencimento ou a renovação de cada uma.

## Objetivo e premissa

Organizar assinaturas de forma simples e tornar seu custo recorrente visível. A tela inicial deve reunir as assinaturas e apresentar automaticamente sua quantidade e o gasto equivalente mensal, sem exigir um botão para calcular.

O produto será local, sem backend, login ou sincronização. Na versão funcional futura, os dados ficarão armazenados no próprio aparelho. A primeira entrega, porém, será um protótipo visual com dados simulados, permitindo ajustar o design antes de implementar as funcionalidades reais.

## Conceitos do produto

- **Assinatura:** serviço acompanhado pelo usuário, com nome, valor, ciclo de cobrança e data de vencimento ou renovação.
- **Nome livre:** o usuário poderá escrever o serviço desejado, sem ficar limitado a um catálogo.
- **Reconhecimento do serviço:** nomes conhecidos, como Netflix e Spotify, deverão associar a assinatura à logo correspondente. A fonte das imagens e o comportamento para serviços desconhecidos ainda precisam ser definidos.
- **Configuração predefinida:** serviços conhecidos poderão oferecer uma sugestão inicial de plano ou valor. O usuário continuará livre para editar o valor e a data. O catálogo e seus valores não estão definidos.
- **Ciclo de cobrança:** mensal, trimestral ou anual. A escolha acontece em um modal inferior acionado pelo campo do modelo de assinatura.
- **Resumo automático:** quantidade de assinaturas e soma dos custos equivalentes mensais, atualizadas quando os dados forem alterados na versão funcional.

Para comparar ciclos diferentes, o equivalente mensal será o valor informado dividido pelo número de meses do ciclo: um, três ou doze. Por exemplo, uma assinatura anual de R$ 120 corresponde a R$ 10 por mês. Esse resumo deve preservar a distinção entre o custo mensal equivalente e o valor efetivamente cobrado na renovação.

## Stack

A base existente usa Expo `~57.0.27` (SDK 57), React `19.2.3`, React Native `0.86.3` e TypeScript `~6.0.3`. O projeto tem `package-lock.json` e scripts para iniciar o Expo. O ambiente de uso informado é Linux com Expo Go no emulador Android.

Ainda não há biblioteca de persistência, catálogo de serviços ou integração externa implementados. A tecnologia de armazenamento local será definida quando houver uma entrega funcional autorizada.

## Estrutura técnica

O repositório contém um template inicial: `index.ts` como entrada, `App.tsx` com a tela padrão, `app.json` para configuração e `assets/` para recursos visuais. A orientação configurada é retrato.

As instruções do projeto determinam Expo Router para navegação futura, com rotas em `src/app/` e componentes, hooks e utilitários fora dessa pasta. Essa organização ainda não está implementada. O código deve priorizar simplicidade, eficiência, manutenção e nomes em português.

## Direção de produto e design

A interface deve ser simples, limpa e adequada ao uso no celular. A tela inicial concentra a lista e o resumo financeiro, com os totais visíveis no próprio conteúdo. A posição exata do resumo, paleta, tipografia e composição das telas serão definidas na etapa de design.

O protótipo deverá representar serviços reconhecíveis e diferentes ciclos de cobrança com dados demonstrativos. Seu propósito é permitir ajustes visuais antes de construir os fluxos reais.

## Escopo e limites atuais

A entrega inicial contempla apenas o aplicativo visual com dados simulados. Cadastro real, edição persistente, exclusão e armazenamento local pertencem à evolução funcional, não à primeira entrega. A representação desses controles no protótipo não implica sua implementação real.

O aplicativo foi concebido para acompanhar informações de assinaturas cadastradas pelo usuário. Integrações com contas dos serviços, pagamentos, notificações e importação automática não fazem parte do escopo confirmado.
