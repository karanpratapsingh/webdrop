export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

export function getEnv(env: string): string {
  const foundEnv = process.env[env];

  if (!foundEnv) {
    throw new Error(`ENV: ${env} not found`);
  }

  return foundEnv;
}

export function getAllowedOrigin(): string {
  const developmentOrigin: string = 'http://localhost:3000';
  return isDevelopment ? developmentOrigin : getEnv('REACT_APP_WEBDROP_PROXY');
}

export function withDefaultString(value: string | undefined, defaultValue: string = ''): string {
  return value ?? defaultValue;
}

export function isMobile(ua: string | undefined): boolean {
  if (!ua) return false;
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  return toMatch.some(toMatchItem => {
    return ua.match(toMatchItem);
  });
}
