import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserDataService } from '../service/user-data.service';
import { UserDetailsDTO } from '../models/UserDetailsDTO';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(UserDataService);
  const router = inject(Router);
  let isAuthenticated: boolean = false;
  let userDetails: UserDetailsDTO | null;
  console.log(state.url);
  localStorage.currentUser.subscribe({
    next: users => {
      userDetails = users ?? null;
      if (userDetails == null) isAuthenticated = false;
      else {
        console.log(userDetails.role);
        const role = route.data['roles'].find((r: string) => {
          return r === userDetails?.role;
        });
        console.log(role);
        isAuthenticated = !!role;
        if (!isAuthenticated) {
          console.log('Unauthorized');
          router.navigate(['/unauthorized']);
        }
      }
    },
  });
  return isAuthenticated;
};
