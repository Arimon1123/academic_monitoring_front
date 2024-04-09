import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {UserDataService} from "../service/user-data.service";

export const authGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(UserDataService);
  const userDetails = localStorage.getUserDetails();
  if (userDetails) {
    return true;
  }
  return false;
};
