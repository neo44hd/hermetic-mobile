import { ENV } from '../config/env';

export async function apiGet(path: string) {
  const res = await fetch(`${ENV.API_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
