import { Text, type TextProps } from 'react-native';
import { cores, tipografia } from '@/theme';

type Propriedades = TextProps & { variante?: keyof typeof tipografia; secundario?: boolean };

export function Texto({ variante = 'corpo', secundario = false, style, ...propriedades }: Propriedades) {
  return (
    <Text
      {...propriedades}
      style={[tipografia[variante], { color: secundario ? cores.textoSecundario : cores.texto }, style]}
    />
  );
}
