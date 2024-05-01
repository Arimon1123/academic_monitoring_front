import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service.service';
import { inject } from '@angular/core';

export const logGuard: CanActivateFn = (route, state) => {
  return true;
};
