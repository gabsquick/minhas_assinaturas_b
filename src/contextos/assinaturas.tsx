import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { Texto } from '@/components/texto';
import { carregarAssinaturas, salvarAssinaturas } from '@/dados/armazenamento-assinaturas';
import { atualizarRenovacao, calcularPrimeiraRenovacao, dadosAssinaturaValidos, type Assinatura, type DadosAssinatura } from '@/dados/assinaturas';
import { cores, espacos, medidas, raios } from '@/theme';

type EstadoAssinaturas = {
  assinaturas: Assinatura[];
  adicionarAssinatura: (dados: DadosAssinatura) => void;
  excluirAssinatura: (id: string) => void;
  editarAssinatura: (id: string, dados: DadosAssinatura) => void;
};

const ContextoAssinaturas = createContext<EstadoAssinaturas | null>(null);

function lerEstadoInicial(): { assinaturas: Assinatura[]; erro: boolean } {
  try {
    return { assinaturas: carregarAssinaturas().map((item) => atualizarRenovacao(item)), erro: false };
  } catch {
    return { assinaturas: [], erro: true };
  }
}

export function ProvedorAssinaturas({ children }: { children: ReactNode }) {
  const [estado, definirEstado] = useState(lerEstadoInicial);
  const assinaturasAtuais = useRef(estado.assinaturas);

  function gravarAlteracoes(assinaturas: Assinatura[]) {
    if (estado.erro) throw new Error('As assinaturas ainda não puderam ser carregadas.');
    salvarAssinaturas(assinaturas);
    // A referência evita perder alterações em ações consecutivas antes do próximo render.
    assinaturasAtuais.current = assinaturas;
    definirEstado({ assinaturas, erro: false });
  }

  function adicionarAssinatura(dados: DadosAssinatura) {
    if (!dadosAssinaturaValidos(dados)) throw new Error('Confira os dados da assinatura.');
    let id: string;
    do {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    } while (assinaturasAtuais.current.some((item) => item.id === id));
    gravarAlteracoes([...assinaturasAtuais.current, {
      ...dados, nome: dados.nome.trim(), id, renovacao: calcularPrimeiraRenovacao(dados.diaRenovacao),
    }]);
  }

  function excluirAssinatura(id: string) {
    gravarAlteracoes(assinaturasAtuais.current.filter((assinatura) => assinatura.id !== id));
  }

  function editarAssinatura(id: string, dados: DadosAssinatura) {
    if (!dadosAssinaturaValidos(dados)) throw new Error('Confira os dados da assinatura.');
    if (!assinaturasAtuais.current.some((item) => item.id === id)) throw new Error('Assinatura não encontrada.');
    gravarAlteracoes(assinaturasAtuais.current.map((assinatura) => {
      if (assinatura.id !== id) return assinatura;
      // Nome e valor preservam o calendário; alterar dia ou ciclo inicia uma nova sequência.
      const mudouCalendario = assinatura.diaRenovacao !== dados.diaRenovacao || assinatura.modelo !== dados.modelo;
      const renovacao = mudouCalendario
        ? calcularPrimeiraRenovacao(dados.diaRenovacao)
        : atualizarRenovacao(assinatura).renovacao;
      return { ...assinatura, ...dados, nome: dados.nome.trim(), renovacao };
    }));
  }

  useEffect(() => {
    if (estado.erro) return;
    function atualizarDatas() {
      const anteriores = assinaturasAtuais.current;
      const atualizadas = anteriores.map((item) => atualizarRenovacao(item));
      if (atualizadas.some((item, indice) => item !== anteriores[indice])) {
        assinaturasAtuais.current = atualizadas;
        definirEstado({ assinaturas: atualizadas, erro: false });
      }
    }
    // Recalcula ao retomar o app e na virada do dia, sem marcar cobranças como pagas.
    const inscricao = AppState.addEventListener('change', (situacao) => {
      if (situacao === 'active') atualizarDatas();
    });
    let temporizador: ReturnType<typeof setTimeout>;
    function agendarViradaDoDia() {
      const agora = new Date();
      const amanha = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
      temporizador = setTimeout(() => {
        atualizarDatas();
        agendarViradaDoDia();
      }, amanha.getTime() - agora.getTime() + 1000);
    }
    agendarViradaDoDia();
    return () => { inscricao.remove(); clearTimeout(temporizador); };
  }, [estado.erro]);

  if (estado.erro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: espacos.extra, gap: espacos.grande, backgroundColor: cores.fundo }}>
        <Texto variante="titulo">Não foi possível carregar suas assinaturas.</Texto>
        <Texto secundario>Os dados salvos foram preservados. Tente abrir novamente.</Texto>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            const novoEstado = lerEstadoInicial();
            assinaturasAtuais.current = novoEstado.assinaturas;
            definirEstado(novoEstado);
          }}
          style={{ minHeight: medidas.campo, backgroundColor: cores.azul, borderRadius: raios.medio, alignItems: 'center', justifyContent: 'center' }}
        >
          <Texto variante="destaque" style={{ color: cores.sobreVerde }}>Tentar novamente</Texto>
        </Pressable>
      </View>
    );
  }

  return (
    <ContextoAssinaturas.Provider value={{ assinaturas: estado.assinaturas, adicionarAssinatura, excluirAssinatura, editarAssinatura }}>
      {children}
    </ContextoAssinaturas.Provider>
  );
}

export function useAssinaturas() {
  const contexto = useContext(ContextoAssinaturas);
  if (!contexto) throw new Error('useAssinaturas deve ser usado dentro de ProvedorAssinaturas.');
  return contexto;
}
