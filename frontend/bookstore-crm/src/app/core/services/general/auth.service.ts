import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { LoginResponse } from '../../models/response/login-response';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'app_jwt_token';
  private readonly USER_KEY  = 'app_user';

  currentUser = signal<User | null>(null);
  isLoggedIn  = signal<boolean>(false);

  constructor() {
    const storedUser = this.loadUser();
    this.currentUser.set(storedUser);
    this.isLoggedIn.set(!!this.getToken());
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login/`, { email: email, password: password })
    .pipe(
        tap(({ token, user }) => {
          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUser.set(user)
          this.isLoggedIn.set(true)
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  private loadUser(): User | null {
    const json = localStorage.getItem(this.USER_KEY);
    console.log(this.USER_KEY);
    console.log(json);
    console.log(localStorage.getItem('app_user'));
    return json ? JSON.parse(json) : null;
  }
}
