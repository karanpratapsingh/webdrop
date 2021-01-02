export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

export function getEnv(env: string): string {
  const foundEnv = process.env[env];

  if (!foundEnv) {
    throw new Error(`ENV: ${env} not found`);
  }

  return foundEnv;
}
