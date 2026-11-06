import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Campo } from '@/components/campo';
import { LogoServico } from '@/components/logo-servico';
import { SeletorDiaRenovacao } from '@/components/seletor-dia-renovacao';
import { SeletorModelo } from '@/components/seletor-modelo';
import { Texto } from '@/components/texto';
import { calcularPrimeiraRenovacao, formatarRenovacao, type Assinatura, type DadosAssinatura, type ModeloAssinatura } from '@/dados/assinaturas';
import { cores, espacos, medidas, raios } from '@/theme';

export function FormularioAssinatura({ assinatura, aoSalvar }: {
  assinatura?: Assinatura;
  aoSalvar: (dados: DadosAssinatura) => void;
}) {
  // O rascunho só altera a lista ao salvar; voltar descarta as mudanças.
  const [nome, definirNome] = useState(assinatura?.nome ?? '');
  const [valor, definirValor] = useState(assinatura ? (assinatura.valorCentavos / 100).toFixed(2).replace('.', ',') : '');
  const [modelo, definirModelo] = useState<ModeloAssinatura>(assinatura?.modelo ?? 'mensal');
  const [diaRenovacao, definirDiaRenovacao] = useState(assinatura?.diaRenovacao ?? new Date().getDate());
  const [tentouSalvar, definirTentouSalvar] = useState(false);
  const [erroSalvamento, definirErroSalvamento] = useState('');
  const salvando = useRef(false);
  const areasSeguras = useSafeAreaInsets();
  const alturaCabecalho = useHeaderHeight();
  const valorDigitado = valor.trim();
  const temMilhares = /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(valorDigitado);
  const valorNormalizado = (temMilhares ? valorDigitado.replace(/\./g, '') : valorDigitado).replace(',', '.');
  const valorCentavos = Math.round(Number(valorNormalizado) * 100);
  const nomeValido = nome.trim().length > 0;
  const valorValido = (temMilhares || /^\d+(?:[.,]\d{1,2})?$/.test(valorDigitado)) && Number.isSafeInteger(valorCentavos) && valorCentavos >= 0;
  const mudouCalendario = !assinatura || assinatura.modelo !== modelo || assinatura.diaRenovacao !== diaRenovacao;
  const proximaRenovacao = assinatura && !mudouCalendario ? assinatura.renovacao : calcularPrimeiraRenovacao(diaRenovacao);

  function salvarAlteracoes() {
    definirTentouSalvar(true);
    definirErroSalvamento('');
    if (!nomeValido || !valorValido || salvando.current) return;
    salvando.current = true;
    try {
      aoSalvar({ nome: nome.trim(), valorCentavos, modelo, diaRenovacao });
    } catch {
      // Mantém o rascunho aberto quando o aparelho não consegue gravar os dados.
      definirErroSalvamento('Não foi possível salvar. Seus campos foram mantidos; tente novamente.');
      salvando.current = false;
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={alturaCabecalho}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: espacos.lateral,
          paddingTop: espacos.grande,
          paddingBottom: areasSeguras.bottom + espacos.grande,
          gap: espacos.extra,
        }}
      >
        <View style={{ alignItems: 'center', gap: espacos.medio }}>
          <LogoServico nome={nome} tamanho={medidas.logoPrevia} />
          <Texto variante="titulo" style={{ textAlign: 'center' }}>{nome.trim() || 'Sua assinatura'}</Texto>
        </View>

        <View style={{ gap: espacos.lateral }}>
          <Campo rotulo="Nome do serviço" value={nome} onChangeText={definirNome} placeholder="Ex.: Netflix, Spotify" autoCorrect={false} autoCapitalize="words" returnKeyType="next" />
          {tentouSalvar && !nomeValido && <Texto variante="legenda" accessibilityRole="alert" style={{ color: '#FFB4AB' }}>Informe o nome da assinatura.</Texto>}
          <Campo rotulo="Valor" prefixo="R$" value={valor} onChangeText={definirValor} placeholder="0,00" keyboardType="decimal-pad" />
          {tentouSalvar && !valorValido && <Texto variante="legenda" accessibilityRole="alert" style={{ color: '#FFB4AB' }}>Informe um valor válido, como 39,90.</Texto>}
          <SeletorModelo modelo={modelo} aoSelecionar={definirModelo} />
          <SeletorDiaRenovacao dia={diaRenovacao} aoSelecionar={definirDiaRenovacao} />
          <Texto variante="legenda" secundario>Próxima renovação: {formatarRenovacao(proximaRenovacao)}. Depois, conforme o ciclo escolhido.</Texto>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', paddingTop: espacos.pequeno }}>
          {erroSalvamento !== '' && <Texto variante="legenda" accessibilityRole="alert" style={{ color: '#FFB4AB', marginBottom: espacos.medio }}>{erroSalvamento}</Texto>}
          <Pressable
            onPress={salvarAlteracoes}
            accessibilityRole="button"
            accessibilityHint="Salva a assinatura no aparelho e volta à lista."
            style={{
              backgroundColor: cores.verde, minHeight: medidas.campo,
              padding: espacos.normal, justifyContent: 'center', alignItems: 'center',
              borderRadius: raios.medio, borderCurve: 'continuous',
            }}
          >
            <Texto variante="destaque" style={{ color: cores.sobreVerde }}>{assinatura ? 'Salvar alterações' : 'Salvar assinatura'}</Texto>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
