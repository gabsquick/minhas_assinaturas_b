import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Texto } from '@/components/texto';
import { obterLogoServico } from '@/dados/logos-servicos';
import { cores, medidas, raios } from '@/theme';

export function LogoServico({ nome, tamanho = medidas.logo }: { nome: string; tamanho?: number }) {
  const servico = obterLogoServico(nome);
  const tamanhoDesenho = tamanho * (servico?.escala ?? 0.54);

  return (
    <View
      accessible={false}
      style={{
        width: tamanho, height: tamanho, flexShrink: 0,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: servico ? cores.fundoMarca : cores.superficieElevada,
        borderRadius: tamanho > medidas.logo ? raios.grande : raios.pequeno,
        borderCurve: 'continuous',
      }}
    >
      {servico ? (
        <SvgXml xml={servico.desenho} width={tamanhoDesenho} height={tamanhoDesenho} accessible={false} />
      ) : (
        <Texto variante="interrogacao" style={{ color: cores.textoSecundario }}>?</Texto>
      )}
    </View>
  );
}
