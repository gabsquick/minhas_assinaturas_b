import { useCallback, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, StyleSheet, View, useWindowDimensions, type ViewProps } from 'react-native';
import { GestureHandlerRootView, Pressable as BotaoGesto } from 'react-native-gesture-handler';
import Swipeable, { SwipeDirection, type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Easing, Extrapolation, interpolate, useAnimatedProps, useAnimatedReaction, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { expo as configuracaoApp } from '../../app.json';
import { FundoResumo } from '@/components/fundo-resumo';
import { Icone } from '@/components/icone';
import { LogoServico } from '@/components/logo-servico';
import { Texto } from '@/components/texto';
import { calcularTotalMensal, formatarRenovacao, formatarValor, obterModelo, type Assinatura } from '@/dados/assinaturas';
import { useAssinaturas } from '@/contextos/assinaturas';
import { obterPaletaDaAbertura, type PaletaFundo } from '@/dados/paletas-fundo';
import { cores, espacos, raios } from '@/theme';

function BotaoAdicionar() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Adicionar assinatura"
      onPress={() => router.push('/nova-assinatura')}
      style={({ pressed }) => ({
        width: 76, height: 76, justifyContent: 'center', alignItems: 'center',
        backgroundColor: pressed ? '#A9DEFA' : cores.azul,
        borderRadius: 28, borderCurve: 'continuous',
        borderWidth: 1, borderColor: '#BCE8FF',
        elevation: 8, shadowColor: '#000000', shadowOpacity: 0.24,
        shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
      })}
    >
      <Icone nome="adicionar" tamanho={34} cor="#14374A" />
    </Pressable>
  );
}

function ResumoMensal({ alturaMinima, assinaturas, paleta }: {
  alturaMinima: number;
  assinaturas: Assinatura[];
  paleta: PaletaFundo;
}) {
  const totalMensal = calcularTotalMensal(assinaturas);
  const [fonteCarregada] = useFonts({
    Allura: require('../../assets/fonts/Allura-Regular.ttf'),
  });

  return (
    <View style={{
      minHeight: alturaMinima, paddingHorizontal: espacos.pequeno,
      paddingVertical: 28, gap: espacos.extra,
    }}>
      <Texto style={{
        color: paleta.texto, fontFamily: fonteCarregada ? 'Allura' : undefined,
        fontSize: fonteCarregada ? 44 : 30, lineHeight: 58, fontWeight: '400',
      }}>Total mensal</Texto>
      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: espacos.grande, gap: espacos.pequeno }}>
        <Texto variante="total" selectable style={{
          color: paleta.texto, fontSize: 54, lineHeight: 66, letterSpacing: -2.6,
          fontWeight: '500', fontVariant: ['tabular-nums'],
        }}>
          {formatarValor(totalMensal)}
        </Texto>
        <Texto style={{ color: paleta.textoSecundario }}>/mês</Texto>
      </View>
      <View style={{
        borderTopWidth: 1, borderTopColor: paleta.separador,
        paddingTop: espacos.grande, gap: espacos.medio,
      }}>
        <Texto variante="destaque" style={{ color: paleta.texto }}>
          Você tem aí {assinaturas.length} {assinaturas.length === 1 ? 'assinatura' : 'assinaturas'}
        </Texto>
        <Texto variante="legenda" style={{ color: paleta.textoSecundario }}>Equivalente mensal de todas as cobranças</Texto>
        {assinaturas.length === 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/nova-assinatura')}
            style={({ pressed }) => ({
              minHeight: 56, padding: espacos.normal, alignItems: 'center', justifyContent: 'center',
              borderRadius: raios.medio, backgroundColor: paleta.texto, opacity: pressed ? 0.8 : 1,
            })}
          >
            <Texto variante="destaque" style={{ color: cores.texto }}>Adicionar assinatura</Texto>
          </Pressable>
        ) : (
          <View style={{
            alignSelf: 'center', marginTop: espacos.pequeno, paddingHorizontal: espacos.normal,
            paddingVertical: espacos.pequeno, borderRadius: raios.pequeno,
            backgroundColor: 'rgba(255, 255, 255, 0.24)',
          }}>
            <Texto variante="detalhe" style={{ color: paleta.textoSecundario }}>Role tudo para baixo, para adicionar assinaturas</Texto>
          </View>
        )}
      </View>
    </View>
  );
}

function CardAssinatura({ assinatura, aoExcluir }: { assinatura: Assinatura; aoExcluir: (id: string) => void }) {
  const [direcaoAberta, definirDirecaoAberta] = useState<SwipeDirection | null>(null);
  const referenciaGesto = useRef<SwipeableMethods>(null);

  function abrirEdicao() {
    referenciaGesto.current?.close();
    router.push({ pathname: '/editar-assinatura', params: { id: assinatura.id } });
  }

  function confirmarExclusao() {
    Alert.alert('Excluir assinatura?', `Deseja remover ${assinatura.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: () => {
          try {
            aoExcluir(assinatura.id);
          } catch {
            Alert.alert('Não foi possível excluir', 'A assinatura foi mantida. Tente novamente.');
          }
        },
      },
    ]);
  }

  return (
    <Swipeable
      ref={referenciaGesto}
      friction={1}
      leftThreshold={48}
      rightThreshold={48}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableOpen={definirDirecaoAberta}
      onSwipeableClose={() => definirDirecaoAberta(null)}
      containerStyle={{ borderRadius: raios.medio, borderCurve: 'continuous' }}
      renderLeftActions={() => (
        <View
          accessibilityElementsHidden={direcaoAberta !== SwipeDirection.RIGHT}
          importantForAccessibility={direcaoAberta === SwipeDirection.RIGHT ? 'auto' : 'no-hide-descendants'}
          style={{ width: 96, paddingRight: espacos.pequeno }}
        >
          {/* O toque usa o mesmo sistema do Swipeable para não ser cancelado pelo gesto do card. */}
          <BotaoGesto
            accessibilityRole="button"
            accessibilityLabel={`Editar assinatura ${assinatura.nome}`}
            onPress={abrirEdicao}
            style={({ pressed }) => ({
              flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center',
              gap: espacos.minimo, padding: espacos.pequeno, borderRadius: raios.medio,
              backgroundColor: pressed ? '#2B4A5B' : cores.azulSuave,
            })}
          >
            <Icone nome="editar" cor={cores.azul} />
            <Texto variante="legenda" style={{ color: cores.azul, fontWeight: '600' }}>Editar</Texto>
          </BotaoGesto>
        </View>
      )}
      renderRightActions={() => (
        <View
          accessibilityElementsHidden={direcaoAberta !== SwipeDirection.LEFT}
          importantForAccessibility={direcaoAberta === SwipeDirection.LEFT ? 'auto' : 'no-hide-descendants'}
          style={{ width: 96, paddingLeft: espacos.pequeno }}
        >
          <BotaoGesto
            accessibilityRole="button"
            accessibilityLabel={`Excluir assinatura ${assinatura.nome}`}
            onPress={confirmarExclusao}
            style={({ pressed }) => ({
              flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center',
              gap: espacos.minimo, padding: espacos.pequeno, borderRadius: raios.medio,
              backgroundColor: pressed ? '#8C3038' : '#652C34',
            })}
          >
            <Icone nome="excluir" cor="#FFE2E4" />
            <Texto variante="legenda" style={{ color: '#FFE2E4', fontWeight: '600' }}>Excluir</Texto>
          </BotaoGesto>
        </View>
      )}
    >
      <View
        accessible
        accessibilityLabel={`${assinatura.nome}, ${formatarValor(assinatura.valorCentavos)}, ${obterModelo(assinatura.modelo).rotulo}. Renova em ${formatarRenovacao(assinatura.renovacao)}`}
        accessibilityActions={[{ name: 'editar', label: 'Editar assinatura' }, { name: 'excluir', label: 'Excluir assinatura' }]}
        onAccessibilityAction={(evento) => {
          if (evento.nativeEvent.actionName === 'editar') abrirEdicao();
          if (evento.nativeEvent.actionName === 'excluir') confirmarExclusao();
        }}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: espacos.medio, padding: espacos.normal,
          borderRadius: raios.medio, borderCurve: 'continuous', backgroundColor: cores.superficie,
        }}>
        <LogoServico nome={assinatura.nome} />
        <View style={{ flex: 1, gap: espacos.minimo }}>
          <Texto variante="destaque" selectable>{assinatura.nome}</Texto>
          <Texto variante="detalhe" secundario>Renova em {formatarRenovacao(assinatura.renovacao)}</Texto>
        </View>
        <View style={{ alignItems: 'flex-end', maxWidth: '40%', gap: espacos.minimo }}>
          <Texto variante="destaque" selectable style={{ fontVariant: ['tabular-nums'], textAlign: 'right' }}>{formatarValor(assinatura.valorCentavos)}</Texto>
          <Texto variante="detalhe" secundario>{obterModelo(assinatura.modelo).rotulo}</Texto>
        </View>
      </View>
    </Swipeable>
  );
}

export default function TelaHome() {
  const [paleta] = useState(obterPaletaDaAbertura);
  const [telaAtiva, definirTelaAtiva] = useState(true);
  const [fundoEscuro, definirFundoEscuro] = useState(false);
  const { assinaturas, excluirAssinatura } = useAssinaturas();
  const areasSeguras = useSafeAreaInsets();
  const { height: alturaJanela, width: larguraJanela } = useWindowDimensions();
  const [alturaDisponivel, definirAlturaDisponivel] = useState(alturaJanela);
  // A viewport medida já exclui as áreas seguras superior e inferior.
  // minHeight permite que o conteúdo cresça quando o texto do sistema for ampliado.
  const alturaResumo = Math.max(0, alturaDisponivel - espacos.normal * 2);
  const distanciaBotaoRodape = areasSeguras.bottom + 64;
  const rolagem = useSharedValue(0);
  const alturaConteudo = useSharedValue(0);
  const alturaViewport = useSharedValue(0);
  // As medidas reais acompanham mudanças na lista; a tolerância evita falhas por arredondamento.
  const chegouAoFinal = useDerivedValue(() => (
    alturaConteudo.get() > 0 && alturaViewport.get() > 0 && rolagem.get() > 0
    && rolagem.get() + alturaViewport.get() >= alturaConteudo.get() - 2
  ));

  useFocusEffect(useCallback(() => {
    definirTelaAtiva(true);
    return () => definirTelaAtiva(false);
  }, []));

  // O contraste da barra muda apenas ao cruzar o limiar, sem atualizar React a cada quadro.
  useAnimatedReaction(
    () => rolagem.get() > alturaResumo * 0.48,
    (escuro, anterior) => {
      if (escuro !== anterior) scheduleOnRN(definirFundoEscuro, escuro);
    },
  );

  // O desvanecimento acompanha o dedo na thread de UI, sem renderizar a lista a cada quadro.
  const acompanharRolagem = useAnimatedScrollHandler((evento) => {
    rolagem.set(Math.max(0, evento.contentOffset.y));
  });
  const estiloResumo = useAnimatedStyle(() => ({
    opacity: interpolate(
      rolagem.get(), [0, alturaResumo * 0.2, Math.max(1, alturaResumo * 0.85)], [1, 0.9, 0], Extrapolation.CLAMP,
    ),
  }));
  const estiloBotao = useAnimatedStyle(() => {
    const visivel = chegouAoFinal.get();
    // A entrada lenta combina transparência e um deslocamento discreto de cima para baixo.
    // withTiming respeita a preferência de movimento reduzido do sistema.
    const configuracao = { duration: 900, easing: Easing.bezier(0.23, 1, 0.32, 1) };

    return {
      // Uma subida rápida pode chegar ao topo antes dos 900 ms do desvanecimento.
      opacity: rolagem.get() <= 0 ? 0 : withTiming(visivel ? 1 : 0, configuracao),
      transform: [{ translateY: withTiming(visivel ? 0 : -18, configuracao) }],
    };
  });
  const propriedadesBotao = useAnimatedProps<ViewProps>(() => {
    const visivel = chegouAoFinal.get();

    // Um botão oculto não deve capturar toques nem receber foco do leitor de tela.
    return {
      pointerEvents: visivel ? 'auto' : 'none',
      accessibilityElementsHidden: !visivel,
      importantForAccessibility: visivel ? 'auto' : 'no-hide-descendants',
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: cores.fundo }}>
      {telaAtiva && <StatusBar style={fundoEscuro ? 'light' : 'dark'} />}
      {/* O fundo fica fora da rolagem, cobre as áreas seguras e desvanece junto com o resumo. */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, estiloResumo]}>
        <FundoResumo paleta={paleta} />
      </Animated.View>
      <View style={{ flex: 1, paddingTop: areasSeguras.top, paddingBottom: areasSeguras.bottom }}>
        <Animated.ScrollView
          style={{ flex: 1 }}
          onLayout={(evento) => {
            const altura = evento.nativeEvent.layout.height;
            definirAlturaDisponivel(altura);
            alturaViewport.set(altura);
          }}
          onContentSizeChange={(_, altura) => alturaConteudo.set(altura)}
          // O contêiner externo reserva as áreas seguras com o cabeçalho oculto.
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          onScroll={acompanharRolagem}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: espacos.normal,
            paddingHorizontal: espacos.lateral,
            gap: espacos.grande,
          }}
        >
          <Animated.View style={estiloResumo}>
            <ResumoMensal alturaMinima={alturaResumo} assinaturas={assinaturas} paleta={paleta} />
          </Animated.View>
          <View style={{
            // A seção ocupa a viewport e mantém uma folga acima do título ao fim da rolagem.
            minHeight: alturaDisponivel,
            paddingTop: espacos.grande,
            paddingBottom: distanciaBotaoRodape + 76 + espacos.grande,
            gap: espacos.medio,
          }}>
            <Texto variante="titulo" style={{ marginBottom: espacos.pequeno }}>Suas assinaturas</Texto>
            {assinaturas.map((assinatura) => (
              <CardAssinatura key={assinatura.id} assinatura={assinatura} aoExcluir={excluirAssinatura} />
            ))}
            {assinaturas.length === 0 && (
              <Texto secundario style={{ paddingVertical: espacos.grande }}>Você ainda não tem assinaturas. Toque em + para cadastrar a primeira.</Texto>
            )}
          </View>
          <Texto variante="detalhe" secundario style={{ textAlign: 'center', paddingBottom: espacos.normal }}>
            {configuracaoApp.version} - Por Rockett, Gabriel.
          </Texto>
        </Animated.ScrollView>
      </View>
      <Animated.View
        animatedProps={propriedadesBotao}
        // Compõe botão, ícone e sombra juntos para evitar resíduos de transparência no Android.
        needsOffscreenAlphaCompositing
        style={[{ position: 'absolute', right: Math.max(32, larguraJanela * 0.16), bottom: distanciaBotaoRodape }, estiloBotao]}
      >
        <BotaoAdicionar />
      </Animated.View>
    </GestureHandlerRootView>
  );
}
