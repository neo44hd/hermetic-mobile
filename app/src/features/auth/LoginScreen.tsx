import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../shared/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('demo@hermetic.app');
  const signInLocal = useAuthStore((s) => s.signInLocal);
  const loading = useAuthStore((s) => s.loading);
return (
    <View style={styles.container}>
      <Text style={styles.title}>Hermetic Mobile</Text>
      <Text style={styles.subtitle}>Login local MVP</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="email"
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Entrar" onPress={() => signInLocal(email.trim())} />
      )}
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
