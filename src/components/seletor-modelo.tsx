import { BottomSheet, RNHostView } from '@expo/ui';
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { Icone } from '@/components/icone';
import { Texto } from '@/components/texto';
import { modelosAssinatura, obterModelo, type ModeloAssinatura } from '@/dados/assinaturas';
import { cores, espacos, medidas, raios } from '@/theme';

export function SeletorModelo({ modelo, aoSelecionar }: {
  modelo: ModeloAssinatura;
  aoSelecionar: (modelo: ModeloAssinatura) => void;
}) {
  const [modalAberto, definirModalAberto] = useState(false);
  const { width: larguraTela, height: alturaTela } = useWindowDimensions();

  function abrirModal() {
    Keyboard.dismiss();
    definirModalAberto(true);
  }

  function selecionarModelo(valor: ModeloAssinatura) {
    aoSelecionar(valor);
    definirModalAberto(false);
  }

  return (
    <View style={{ gap: espacos.pequeno }}>
      <Texto variante="legenda" secundario>Modelo de assinatura</Texto>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Modelo de assinatura: ${obterModelo(modelo).rotulo}`}
        accessibilityHint="Abre as opções de frequência de cobrança."
        accessibilityState={{ expanded: modalAberto }}
        onPress={abrirModal}
        style={({ pressed }) => ({
          minHeight: medidas.campo, paddingHorizontal: espacos.normal, paddingVertical: espacos.medio,
          flexDirection: 'row', alignItems: 'center', gap: espacos.medio,
          backgroundColor: pressed ? cores.superficieElevada : cores.superficie,
          borderRadius: raios.medio, borderCurve: 'continuous',
          borderWidth: 1, borderColor: modalAberto ? cores.azul : cores.superficie,
        })}
      >
        <Texto style={{ flex: 1 }}>{obterModelo(modelo).rotulo}</Texto>
        <Icone nome="expandir" cor={cores.azul} tamanho={20} />
      </Pressable>

      {/* A apresentação nativa cuida do gesto de fechar, do fundo escurecido e do botão voltar. */}
      <BottomSheet
        isPresented={modalAberto}
        onDismiss={() => definirModalAberto(false)}
        containerColor={cores.fundo}
        contentColor={cores.texto}
        scrimColor="rgba(0, 0, 0, 0.65)"
        contentPadding={{ left: espacos.grande, right: espacos.grande, bottom: espacos.grande }}
      >
        <RNHostView matchContents>
          {/* A largura respeita o limite do painel nativo; textos ampliados podem rolar. */}
          <ScrollView
            style={{ width: Math.min(larguraTela, 640) - espacos.grande * 2, maxHeight: alturaTela * 0.72 }}
            contentContainerStyle={{ gap: espacos.grande, paddingBottom: espacos.pequeno }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ gap: espacos.pequeno }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: espacos.pequeno }}>
                <Texto variante="titulo" accessibilityRole="header" style={{ flex: 1 }}>Modelo de assinatura</Texto>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar seleção de modelo"
                  onPress={() => definirModalAberto(false)}
                  style={({ pressed }) => ({
                    width: medidas.toque, height: medidas.toque, alignItems: 'center', justifyContent: 'center',
                    borderRadius: raios.medio, backgroundColor: pressed ? cores.superficieElevada : cores.superficie,
                  })}
                >
                  <Icone nome="fechar" tamanho={20} cor={cores.textoSecundario} />
                </Pressable>
              </View>
              <Texto secundario>Com que frequência acontece a cobrança?</Texto>
            </View>

            <View style={{ gap: espacos.medio }}>
              {modelosAssinatura.map((opcao) => {
                const selecionado = modelo === opcao.valor;

                return (
                  <Pressable
                    key={opcao.valor}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selecionado }}
                    accessibilityLabel={`${opcao.rotulo}, ${opcao.meses === 1 ? 'cobrança todo mês' : `cobrança a cada ${opcao.meses} meses`}`}
                    onPress={() => selecionarModelo(opcao.valor)}
                    style={({ pressed }) => ({
                      minHeight: 76, padding: espacos.normal, flexDirection: 'row', alignItems: 'center',
                      gap: espacos.normal, borderRadius: raios.medio, borderCurve: 'continuous',
                      borderWidth: 1, borderColor: selecionado ? cores.verde : cores.borda,
                      backgroundColor: selecionado ? '#233C2F' : pressed ? cores.superficieElevada : cores.superficie,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <View style={{ flex: 1, gap: espacos.minimo }}>
                      <Texto variante="destaque" style={{ color: selecionado ? cores.verde : cores.texto }}>{opcao.rotulo}</Texto>
                      <Texto variante="legenda" secundario>
                        {opcao.meses === 1 ? 'Todo mês' : `A cada ${opcao.meses} meses`}
                      </Texto>
                    </View>
                    <View style={{
                      width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
                      borderWidth: selecionado ? 0 : 1.5, borderColor: cores.textoSecundario,
                      backgroundColor: selecionado ? cores.verde : 'transparent',
                    }}>
                      {selecionado && <Icone nome="confirmar" tamanho={17} cor={cores.sobreVerde} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </RNHostView>
      </BottomSheet>
    </View>
  );
}
