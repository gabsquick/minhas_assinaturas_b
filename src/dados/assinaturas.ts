export const modelosAssinatura = [
  { valor: 'mensal', rotulo: 'Mensal', meses: 1 },
  { valor: 'trimestral', rotulo: 'Trimestral', meses: 3 },
  { valor: 'anual', rotulo: 'Anual', meses: 12 },
] as const;

export type ModeloAssinatura = (typeof modelosAssinatura)[number]['valor'];

export type Assinatura = {
  id: string;
  nome: string;
  valorCentavos: number;
  modelo: ModeloAssinatura;
  renovacao: string;
  diaRenovacao: number;
};

export type DadosAssinatura = Pick<Assinatura, 'nome' | 'valorCentavos' | 'modelo' | 'diaRenovacao'>;

export function dadosAssinaturaValidos(dados: unknown): dados is DadosAssinatura {
  if (!dados || typeof dados !== 'object') return false;
  const item = dados as Partial<DadosAssinatura>;
  return typeof item.nome === 'string' && item.nome.trim().length > 0
    && typeof item.valorCentavos === 'number' && Number.isSafeInteger(item.valorCentavos) && item.valorCentavos >= 0
    && modelosAssinatura.some((opcao) => opcao.valor === item.modelo)
    && typeof item.diaRenovacao === 'number' && Number.isInteger(item.diaRenovacao)
    && item.diaRenovacao >= 1 && item.diaRenovacao <= 31;
}

export function obterDataHoje() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}

function montarDataRenovacao(ano: number, mes: number, dia: number) {
  // O dia escolhido permanece 31, mesmo quando a cobrança cair em 28, 29 ou 30.
  const ultimoDia = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
  return new Date(Date.UTC(ano, mes, Math.min(dia, ultimoDia))).toISOString().slice(0, 10);
}

export function calcularPrimeiraRenovacao(dia: number, hoje = obterDataHoje()) {
  const [ano, mes] = hoje.split('-').map(Number);
  const data = montarDataRenovacao(ano, mes - 1, dia);
  return data >= hoje ? data : montarDataRenovacao(ano, mes, dia);
}

export function atualizarRenovacao(assinatura: Assinatura, hoje = obterDataHoje()): Assinatura {
  if (assinatura.renovacao >= hoje) return assinatura;
  const [ano, mes] = assinatura.renovacao.split('-').map(Number);
  const [anoAtual, mesAtual] = hoje.split('-').map(Number);
  const mesesCiclo = obterModelo(assinatura.modelo).meses;
  const mesesDecorridos = (anoAtual - ano) * 12 + mesAtual - mes;
  let ciclos = Math.max(0, Math.floor(mesesDecorridos / mesesCiclo));
  let renovacao = montarDataRenovacao(ano, mes - 1 + ciclos * mesesCiclo, assinatura.diaRenovacao);
  if (renovacao < hoje) {
    ciclos += 1;
    renovacao = montarDataRenovacao(ano, mes - 1 + ciclos * mesesCiclo, assinatura.diaRenovacao);
  }
  return { ...assinatura, renovacao };
}

export function obterModelo(modelo: ModeloAssinatura) {
  return modelosAssinatura.find((opcao) => opcao.valor === modelo)!;
}

export function calcularTotalMensal(assinaturas: Assinatura[]) {
  // Normaliza ciclos diferentes e arredonda somente a soma para evitar perdas por item.
  const total = assinaturas.reduce((soma, assinatura) => {
    return soma + assinatura.valorCentavos / obterModelo(assinatura.modelo).meses;
  }, 0);
  return Math.round(total);
}

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });

export function formatarValor(valorCentavos: number) {
  return formatoMoeda.format(valorCentavos / 100);
}

export function formatarRenovacao(data: string) {
  // A data de cobrança não tem horário: UTC impede que o fuso altere o dia exibido.
  return formatoData.format(new Date(`${data}T12:00:00Z`));
}
