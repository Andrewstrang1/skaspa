// api-config.ts

export interface ApiConfig {
  name: string;
  baseUrl: string;
  path: string;
  token?: string | null;
  username?: string | null;
  password?: string | null;
}

export const apiConfig: ApiConfig[] = [
  {
    name: 'ProductsAPI',
    baseUrl: 'http://localhost:3000',
    path: 'api/products/all',
    token: null,
    username: null,
    password: null
  },
  // Additional API configurations can be added here as needed
];
