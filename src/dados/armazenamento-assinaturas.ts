import 'expo-sqlite/localStorage/install';
import { dadosAssinaturaValidos, type Assinatura } from '@/dados/assinaturas';

const chaveAssinaturas = 'minhas-assinaturas.dados.v1';

export function carregarAssinaturas(): Assinatura[] {
  const conteudo = localStorage.getItem(chaveAssinaturas);
  if (conteudo === null) return [];
  const dados: unknown = JSON.parse(conteudo);

  // Uma leitura inválida bloqueia o acesso em vez de sobrescrever os dados com uma lista vazia.
  if (!Array.isArray(dados) || !dados.every((item: unknown) => {
    if (!dadosAssinaturaValidos(item)) return false;
    const assinatura = item as Partial<Assinatura>;
    return typeof assinatura.id === 'string' && assinatura.id.length > 0
      && typeof assinatura.renovacao === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(assinatura.renovacao)
      && Number.isFinite(Date.parse(`${assinatura.renovacao}T12:00:00Z`))
      && new Date(`${assinatura.renovacao}T12:00:00Z`).toISOString().slice(0, 10) === assinatura.renovacao;
  }) || new Set(dados.map((item: Assinatura) => item.id)).size !== dados.length) {
    throw new Error('Não foi possível ler as assinaturas salvas.');
  }
  return dados;
}

export function salvarAssinaturas(assinaturas: Assinatura[]) {
  // A escrita termina antes de atualizar a interface ou fechar o formulário.
  localStorage.setItem(chaveAssinaturas, JSON.stringify(assinaturas));
}
