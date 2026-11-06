import Svg, { Path } from 'react-native-svg';
import { cores, medidas } from '@/theme';

const desenhos = {
  editar: 'M14 5l5 5M4 20l5-1L20 8a2 2 0 0 0-5-5L4 14v6Z',
  expandir: 'M6 9l6 6 6-6',
  fechar: 'M6 6l12 12M6 18 18 6',
  confirmar: 'M5 12l4 4L19 6',
  excluir: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  adicionar: 'M12 5v14M5 12h14',
  calendario: 'M8 3v4M16 3v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1ZM8 14h3M8 17h6',
  assinaturas: 'M6 4h12v16H6ZM9 8h6M9 12h6M9 16h3',
};

export function Icone({ nome, tamanho = medidas.icone, cor = cores.texto }: {
  nome: keyof typeof desenhos;
  tamanho?: number;
  cor?: string;
}) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" accessible={false}>
      <Path d={desenhos[nome]} fill="none" stroke={cor} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
