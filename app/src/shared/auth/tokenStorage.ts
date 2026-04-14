import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/auth';

const TOKEN_KEY = 'hermetic.auth.token';
const USER_KEY = 'hermetic.auth.user';

export async function saveAuth(token: string, user: User) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function readAuth() {
  const entries = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  const token = entries.find(([k]) => k === TOKEN_KEY)?.[1] ?? null;
  const userRaw = entries.find(([k]) => k === USER_KEY)?.[1] ?? null;
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
