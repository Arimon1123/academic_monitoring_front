import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service.service';
import { LocalStorageService } from '../service/local-storage.service';



export const authGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLogged = authService.isLoggedIn();
  const userDetails = localStorageService.getItem('userDetails');
  if (!userDetails || !isLogged) {
    router.navigate(['/login']);
    return false;
  }
  const user = JSON.parse(userDetails || '{}');
  const requiredRoles = route.data['roles'];
  const userRoles = user.role.map((role: any) => role.name);
  let isRequiredRole = false;
  userRoles.map((role: any) => {
    if (requiredRoles.indexOf(role) !== -1) {
      isRequiredRole = true;
    }
  });
  if (isLogged && isRequiredRole) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }

};
