import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/auth';

const ACCESS_KEY = 'hermetic.auth.accessToken';
const REFRESH_KEY = 'hermetic.auth.refreshToken';
const USER_KEY = 'hermetic.auth.user';

export async function saveAuth(accessToken: string, refreshToken: string, user: User) {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, accessToken],
    [REFRESH_KEY, refreshToken],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function saveAccessToken(accessToken: string) {
  await AsyncStorage.setItem(ACCESS_KEY, accessToken);
}

export async function readAuth() {
  const entries = await AsyncStorage.multiGet([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
  const accessToken = entries.find(([k]) => k === ACCESS_KEY)?.[1] ?? null;
  const refreshToken = entries.find(([k]) => k === REFRESH_KEY)?.[1] ?? null;
  const userRaw = entries.find(([k]) => k === USER_KEY)?.[1] ?? null;
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { accessToken, refreshToken, user };
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
}
