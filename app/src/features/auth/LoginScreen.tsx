import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../shared/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('demo@hermetic.app');
  const [password, setPassword] = useState('demo1234');
  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);

  const onSubmit = async () => {
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Login error', e?.message ?? 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hermetic Mobile</Text>
      <Text style={styles.subtitle}>Login API</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="email"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="password"
        style={styles.input}
      />

      {loading ? <ActivityIndicator /> : <Button title="Entrar" onPress={onSubmit} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, opacity: 0.7 },
  input: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
