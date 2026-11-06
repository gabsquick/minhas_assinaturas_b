import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { PaletaFundo } from '@/dados/paletas-fundo';

// O padrão fixo evita recalcular o ruído durante a rolagem e mantém a textura leve.
const graos = Array.from({ length: 96 }, (_, indice) => ({
  x: (indice * 37.17) % 64,
  y: (indice * indice * 13.31) % 64,
  raio: indice % 3 === 0 ? 0.7 : 0.4,
}));

export const FundoResumo = memo(function FundoResumo({ paleta }: { paleta: PaletaFundo }) {
  return (
    <View pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" accessible={false}>
        <Defs>
          <LinearGradient id="degradeResumo" x1="0%" y1="0%" x2="90%" y2="100%">
            <Stop offset="0" stopColor={paleta.degrade[0]} />
            <Stop offset="0.38" stopColor={paleta.degrade[1]} />
            <Stop offset="0.72" stopColor={paleta.degrade[2]} />
            <Stop offset="1" stopColor={paleta.degrade[3]} />
          </LinearGradient>
          <RadialGradient id="luzResumo" cx="12%" cy="24%" rx="95%" ry="65%">
            <Stop offset="0" stopColor={paleta.luz} stopOpacity={0.64} />
            <Stop offset="1" stopColor={paleta.luz} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="nevoaResumo" cx="100%" cy="72%" rx="85%" ry="55%">
            <Stop offset="0" stopColor={paleta.nevoa} stopOpacity={0.55} />
            <Stop offset="1" stopColor={paleta.nevoa} stopOpacity={0} />
          </RadialGradient>
          <Pattern id="granuladoResumo" width={64} height={64} patternUnits="userSpaceOnUse">
            {graos.map((grao, indice) => (
              <Circle key={indice} cx={grao.x} cy={grao.y} r={grao.raio}
                fill={indice % 2 === 0 ? '#FFFFFF' : paleta.texto} opacity={0.19} />
            ))}
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#degradeResumo)" />
        <Rect width="100%" height="100%" fill="url(#luzResumo)" />
        <Rect width="100%" height="100%" fill="url(#nevoaResumo)" />
        <Rect width="100%" height="100%" fill="url(#granuladoResumo)" />
        <Rect width="100%" height="100%" fill="#FFFFFF" opacity={0.06} />
      </Svg>
    </View>
  );
});
