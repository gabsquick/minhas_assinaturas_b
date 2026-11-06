import type { TextStyle } from 'react-native';

// A paleta fixa preserva o tema escuro escolhido, mesmo em aparelhos no modo claro.
export const cores = {
  fundo: '#111714',
  superficie: '#202824',
  superficieElevada: '#29352F',
  borda: '#344239',
  texto: '#F3F6F4',
  textoSecundario: '#AAB8B0',
  azul: '#75CFFF',
  azulSuave: '#1D303A',
  verde: '#B9E6C5',
  sobreVerde: '#173625',
  separadorVerde: '#9CC9A8',
  marcaNetflix: '#E50914',
  marcaSpotify: '#1DB954',
  fundoMarca: '#131916',
};

export const espacos = { minimo: 4, pequeno: 8, medio: 12, normal: 16, lateral: 20, grande: 24, extra: 32, amplo: 40 };
export const raios = { pequeno: 12, medio: 16, grande: 24 };
export const medidas = { toque: 48, campo: 56, logo: 48, logoPrevia: 88, icone: 22 };

export const tipografia = {
  detalhe: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
  legenda: { fontSize: 13, lineHeight: 19, fontWeight: '400' },
  corpo: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  destaque: { fontSize: 16, lineHeight: 23, fontWeight: '600' },
  titulo: { fontSize: 20, lineHeight: 28, fontWeight: '600', letterSpacing: -0.4 },
  total: { fontSize: 44, lineHeight: 54, fontWeight: '600', letterSpacing: -1.8 },
  interrogacao: { fontSize: 28, lineHeight: 34, fontWeight: '500' },
} as const satisfies Record<string, TextStyle>;
