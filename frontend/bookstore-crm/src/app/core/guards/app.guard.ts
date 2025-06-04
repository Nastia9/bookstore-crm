import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/general/auth.service';
import { UserRole } from '../models/enums/user-role';

export const appGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    if (state.url === '/' || state.url === '/home') {
      return true;
    }
    return router.parseUrl('/home');
  }

  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    return router.parseUrl('/home');
  }
  const role = currentUser.role;

  const allowedPaths: Record<UserRole, string[]> = {
    [UserRole.customer]: [ 'home', 'profile' ],
    [UserRole.employee]: [ 'home', 'orders', 'warehouse', 'profile' ],
    [UserRole.admin]:    [ 'home', 'orders', 'warehouse', 'users', 'profile' ]
  };

  const requestedRoutePath = route.routeConfig?.path ?? '';

  if (allowedPaths[role].includes(requestedRoutePath)) {
    return true;
  }

  return router.parseUrl('/home');
};