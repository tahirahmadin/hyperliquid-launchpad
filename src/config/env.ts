// Environment variables type definitions
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const getEnvVar = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    throw new Error(
      `Environment variable ${key} is required but not defined. ` +
      `Please check your .env file`
    );
  }
  
  return value;
};

export const config = {
  apiUrl: getEnvVar('VITE_API_URL'),
  // Add other config values here
} as const;

// Type for the config object
export type Config = typeof config;
