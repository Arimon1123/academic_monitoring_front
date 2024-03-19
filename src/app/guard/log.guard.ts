import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service.service';
import { inject } from '@angular/core';

export const logGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logged = authService.isLoggedIn();
  if (logged) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
