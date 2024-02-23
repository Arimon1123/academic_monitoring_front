import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service.service';



export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const isLogged = authService.isLoggedIn();
  const userDetails = localStorage.getItem('userDetails');
  if (!userDetails) {
    return false;
  }
  const user = JSON.parse(userDetails?.toString() || '{}');
  const requiredRoles = route.data['roles'];
  const userRoles = user.role.map((role: any) => role.role);
  let isRequiredRole = false;
  userRoles.map((role: any) => {
    if (requiredRoles.indexOf(role) !== -1) {
      isRequiredRole = true;
    }
  });
  if (isLogged && isRequiredRole) {
    console.log('isLogged', isLogged);
    return true;
  } else {
    console.log('isLogged NOT ', isLogged);
    console.log('isRequiredRole NOT ', isRequiredRole);
    router.navigate(['/unauthorized']);
    return false;
  }

};
