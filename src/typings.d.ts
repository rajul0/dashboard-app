export {};

interface User {
  _id: string;
  username: string;
  passwordHash: string;
}

declare global {
  interface Window {
    electronAPI?: {
      saveUser: (
        username: string,
        password: string
      ) => Promise<{ success: boolean; error?: string }>;

      getUser: (username: string) => Promise<User | null>;

      verifyPassword: (password: string, hash: string) => Promise<boolean>;
    };
  }
}
