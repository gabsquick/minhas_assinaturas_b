import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Texto } from '@/components/texto';
import { cores, espacos, medidas, raios, tipografia } from '@/theme';

type Propriedades = TextInputProps & { rotulo: string; prefixo?: string; sufixo?: ReactNode };

export function Campo({ rotulo, prefixo, sufixo, onFocus, onBlur, style, ...propriedades }: Propriedades) {
  const [emFoco, definirFoco] = useState(false);

  return (
    <View style={{ gap: espacos.pequeno }}>
      <Texto variante="legenda" secundario>{rotulo}</Texto>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: espacos.medio,
        backgroundColor: cores.superficie, borderRadius: raios.medio, borderCurve: 'continuous',
        paddingHorizontal: espacos.normal, borderWidth: 1, borderColor: emFoco ? cores.azul : cores.superficie,
      }}>
        {prefixo && <Texto secundario>{prefixo}</Texto>}
        <TextInput
          {...propriedades}
          accessibilityLabel={rotulo}
          placeholderTextColor={cores.textoSecundario}
          selectionColor={cores.azul}
          cursorColor={cores.azul}
          onFocus={(evento) => { definirFoco(true); onFocus?.(evento); }}
          onBlur={(evento) => { definirFoco(false); onBlur?.(evento); }}
          style={[tipografia.corpo, { flex: 1, minHeight: medidas.campo, color: cores.texto, paddingVertical: espacos.medio }, style]}
        />
        {sufixo}
      </View>
    </View>
  );
}
