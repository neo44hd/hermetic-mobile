import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'hermetic.auth.token';
const USER_KEY = 'hermetic.auth.user';

export async function saveAuth(token: string, user: unknown) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function readAuth() {
  const [token, user] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  return {
    token: token?.[1] ?? null,
    user: user?.[1] ? JSON.parse(user[1]) : null,
  };
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
