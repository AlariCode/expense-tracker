export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
