export interface User {
  readonly id: number;
  readonly username: string;
  readonly displayName: string;
  readonly email?: string;
}
