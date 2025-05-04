import { Injectable }         from '@angular/core';
import { BehaviorSubject }    from 'rxjs';
import { Router }             from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'auth_token';
  private logged$ = new BehaviorSubject(!!localStorage.getItem(this.key));

  isLoggedIn$ = this.logged$.asObservable();

  isLoggedIn(): boolean {
    return this.logged$.value;
  }

  login(token: string) {
    localStorage.setItem(this.key, token);
    this.logged$.next(true);
  }

  logout() {
    localStorage.removeItem(this.key);
    this.logged$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string|null {
    return localStorage.getItem(this.key);
  }

  getUsername(): string {
    const t = this.getToken();
    if (!t) return '';
    try {
      const p = JSON.parse(atob(t.split('.')[1]));
      return p.username || '';
    } catch {
      return '';
    }
  }

  hasRole(r: string): boolean {
    return true;
    // const t = this.getToken();
    // if (!t) return false;
    // try {
    //   const p = JSON.parse(atob(t.split('.')[1]));
    //   return (p.roles||[]).includes(r);
    // } catch {
    //   return false;
    // }
  }

  constructor(private router: Router) {}
}

