import { BottomSheet, RNHostView } from '@expo/ui';
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { Icone } from '@/components/icone';
import { Texto } from '@/components/texto';
import { cores, espacos, medidas, raios } from '@/theme';

const diasDoMes = Array.from({ length: 31 }, (_, indice) => indice + 1);

export function SeletorDiaRenovacao({ dia, aoSelecionar }: {
  dia: number;
  aoSelecionar: (dia: number) => void;
}) {
  const [modalAberto, definirModalAberto] = useState(false);
  const { width: larguraTela, height: alturaTela, fontScale: escalaFonte } = useWindowDimensions();
  const larguraConteudo = Math.min(larguraTela, 640) - espacos.grande * 2;
  // Reduzir as colunas preserva os alvos de toque e a leitura com fontes ampliadas.
  const tamanhoMinimoDia = Math.max(medidas.toque, 32 * escalaFonte);
  const colunas = Math.max(1, Math.min(7, Math.floor((larguraConteudo + espacos.minimo) / (tamanhoMinimoDia + espacos.minimo))));
  const larguraDia = (larguraConteudo - espacos.minimo * (colunas - 1)) / colunas;

  function abrirModal() {
    Keyboard.dismiss();
    definirModalAberto(true);
  }

  function selecionarDia(diaSelecionado: number) {
    aoSelecionar(diaSelecionado);
    definirModalAberto(false);
  }

  return (
    <View style={{ gap: espacos.pequeno }}>
      <Texto variante="legenda" secundario>Todo dia...</Texto>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Dia da renovação: ${dia}`}
        accessibilityHint="Abre o calendário para escolher um dia do mês."
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
        <Texto style={{ flex: 1 }}>{dia}</Texto>
        <Icone nome="calendario" cor={cores.azul} />
      </Pressable>

      <BottomSheet
        isPresented={modalAberto}
        onDismiss={() => definirModalAberto(false)}
        containerColor={cores.fundo}
        contentColor={cores.texto}
        scrimColor="rgba(0, 0, 0, 0.65)"
        contentPadding={{ left: espacos.grande, right: espacos.grande, bottom: espacos.grande }}
      >
        <RNHostView matchContents>
          <ScrollView
            style={{ width: larguraConteudo, maxHeight: alturaTela * 0.72 }}
            contentContainerStyle={{ gap: espacos.grande, paddingBottom: espacos.pequeno }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ gap: espacos.pequeno }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: espacos.pequeno }}>
                <Texto variante="titulo" accessibilityRole="header" style={{ flex: 1 }}>Dia da renovação</Texto>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar seleção de dia"
                  onPress={() => definirModalAberto(false)}
                  style={({ pressed }) => ({
                    width: medidas.toque, height: medidas.toque, alignItems: 'center', justifyContent: 'center',
                    borderRadius: raios.medio, backgroundColor: pressed ? cores.superficieElevada : cores.superficie,
                  })}
                >
                  <Icone nome="fechar" tamanho={20} cor={cores.textoSecundario} />
                </Pressable>
              </View>
              <Texto secundario>Toque no dia do mês em que a cobrança acontece.</Texto>
            </View>

            {/* Sem mês ou dias da semana: a escolha representa um dia recorrente, não uma data específica. */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espacos.minimo }}>
              {diasDoMes.map((opcao) => {
                const selecionado = dia === opcao;

                return (
                  <Pressable
                    key={opcao}
                    accessibilityRole="radio"
                    accessibilityLabel={`Dia ${opcao}`}
                    accessibilityState={{ checked: selecionado }}
                    onPress={() => selecionarDia(opcao)}
                    style={({ pressed }) => ({
                      width: larguraDia, minHeight: tamanhoMinimoDia, paddingVertical: espacos.medio,
                      alignItems: 'center', justifyContent: 'center', borderRadius: raios.pequeno,
                      backgroundColor: selecionado ? cores.verde : pressed ? cores.superficieElevada : cores.superficie,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Texto variante="destaque" style={{ color: selecionado ? cores.sobreVerde : cores.texto }}>{opcao}</Texto>
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
