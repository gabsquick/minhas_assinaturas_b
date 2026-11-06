import 'expo-sqlite/localStorage/install';

export type PaletaFundo = {
  nome: string;
  degrade: readonly [string, string, string, string];
  luz: string;
  nevoa: string;
  texto: string;
  textoSecundario: string;
  separador: string;
};

const paletas: readonly PaletaFundo[] = [
  {
    nome: 'verde-azul',
    degrade: ['#CBECC4', '#AFE1C9', '#A1DAD9', '#83BEEB'],
    luz: '#F3FFDC', nevoa: '#79ADEA',
    texto: '#173625', textoSecundario: '#36594D', separador: 'rgba(23, 54, 37, 0.16)',
  },
  {
    nome: 'vermelho-laranja',
    degrade: ['#F2AAA8', '#F0ABA0', '#F3BC98', '#F4CB94'],
    luz: '#FFE2D1', nevoa: '#F19F67',
    texto: '#4D2523', textoSecundario: '#654039', separador: 'rgba(77, 37, 35, 0.16)',
  },
  {
    nome: 'roxo-azul',
    degrade: ['#D0BEED', '#BEACE8', '#AAB8EB', '#87BEED'],
    luz: '#EFE1FF', nevoa: '#7D9BEB',
    texto: '#30254C', textoSecundario: '#4C4565', separador: 'rgba(48, 37, 76, 0.16)',
  },
];

const chavePaleta = 'minhas-assinaturas.fundo.v1';
let paletaDaSessao: PaletaFundo | undefined;

export function obterPaletaDaAbertura(): PaletaFundo {
  // A escolha é feita uma vez por sessão, para não trocar a cor ao voltar do cadastro ou da edição.
  if (paletaDaSessao) return paletaDaSessao;

  let indice = 0;
  try {
    const ultimaPaleta = localStorage.getItem(chavePaleta);
    indice = (paletas.findIndex((paleta) => paleta.nome === ultimaPaleta) + 1) % paletas.length;
    localStorage.setItem(chavePaleta, paletas[indice].nome);
  } catch {
    // Uma falha na preferência visual não bloqueia o acesso às assinaturas.
  }

  paletaDaSessao = paletas[indice];
  return paletaDaSessao;
}
