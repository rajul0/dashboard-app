import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async login(
    username: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res: any = await this.http
        .post(`${this.apiUrl}/account/login`, { username, password })
        .toPromise();

      return { success: true, token: res };
    } catch (err: any) {
      console.warn('Login via API gagal, coba offline:', err);

      if (window.electronAPI) {
        try {
          const localUser = await window.electronAPI.getUser(username);
          if (localUser) {
            const valid = await window.electronAPI.verifyPassword(
              password,
              localUser.passwordHash
            );
            if (valid) {
              return { success: true, token: 'offline-token-' + username };
            } else {
              console.error('Login offline failed: Password not valid');
              return { success: false, error: 'Password tidak valid' };
            }
          } else {
            return { success: false, error: 'User not found' };
          }
        } catch (offlineErr: any) {
          return {
            success: false,
            error: offlineErr.message || 'Login offline failed',
          };
        }
      }

      return { success: false, error: err.message || 'Login failed' };
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
