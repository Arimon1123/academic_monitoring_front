import { CanActivateFn, Router } from '@angular/router';
import { Inject, inject } from '@angular/core';
import { UserService } from '../service/user.service';
import { AuthServiceService } from '../service/auth-service.service';


export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthServiceService);
  const userService = inject(UserService);
  const router = inject(Router);
  const isLogged = authService.isLoggedIn();
  const userDetails = localStorage.getItem('userDetails');
  const user = JSON.parse(userDetails?.toString() || '{}');
  if (isLogged && user.role === 'ADMINISTRATIVE') {
    return true;
  } else {
    router.navigate(['/login']);
  }
  return false;
};
