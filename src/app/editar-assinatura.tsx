import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { FormularioAssinatura } from '@/components/formulario-assinatura';
import { Texto } from '@/components/texto';
import { useAssinaturas } from '@/contextos/assinaturas';
import { espacos } from '@/theme';

export default function TelaEditarAssinatura() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { assinaturas, editarAssinatura } = useAssinaturas();
  const assinatura = assinaturas.find((item) => item.id === id);

  if (!assinatura) {
    return <View style={{ padding: espacos.grande }}><Texto>Assinatura não encontrada.</Texto></View>;
  }

  return (
    <FormularioAssinatura
      key={assinatura.id}
      assinatura={assinatura}
      aoSalvar={(dados) => {
        editarAssinatura(assinatura.id, dados);
        if (router.canGoBack()) router.back();
        else router.replace('/');
      }}
    />
  );
}
