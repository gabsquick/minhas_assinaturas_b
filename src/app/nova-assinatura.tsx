import { router } from 'expo-router';
import { FormularioAssinatura } from '@/components/formulario-assinatura';
import { useAssinaturas } from '@/contextos/assinaturas';

export default function TelaNovaAssinatura() {
  const { adicionarAssinatura } = useAssinaturas();
  return (
    <FormularioAssinatura aoSalvar={(dados) => {
      adicionarAssinatura(dados);
      if (router.canGoBack()) router.back();
      else router.replace('/');
    }} />
  );
}
