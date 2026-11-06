import { Stack } from 'expo-router/stack';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { ProvedorAssinaturas } from '@/contextos/assinaturas';
import { cores, tipografia } from '@/theme';

const temaNavegacao = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: cores.fundo, card: cores.fundo, text: cores.texto, primary: cores.azul, border: cores.borda },
};

export default function LayoutPrincipal() {
  return (
    <ProvedorAssinaturas>
      <ThemeProvider value={temaNavegacao}>
        <StatusBar style="light" />
        <Stack screenOptions={{
          headerStyle: { backgroundColor: cores.fundo },
          headerTintColor: cores.azul,
          headerTitleStyle: { color: cores.texto, fontSize: tipografia.titulo.fontSize, fontWeight: '600' },
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          contentStyle: { backgroundColor: cores.fundo },
        }}>
          <Stack.Screen name="index" options={{ title: 'Minhas Assinaturas', headerShown: false }} />
          <Stack.Screen name="nova-assinatura" options={{ title: 'Nova assinatura' }} />
          <Stack.Screen name="editar-assinatura" options={{ title: 'Editar assinatura' }} />
        </Stack>
      </ThemeProvider>
    </ProvedorAssinaturas>
  );
}
