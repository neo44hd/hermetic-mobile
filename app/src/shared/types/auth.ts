export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  loading: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};
