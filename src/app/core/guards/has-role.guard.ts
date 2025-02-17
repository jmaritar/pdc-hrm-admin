import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserRole } from 'backend';
import { map } from 'rxjs';
import { AuthService } from '@modules/auth/data-access/auth.service';


export const hasRoleGuard = (roles: UserRole[]): CanActivateFn => {
  return () => {
    return inject(AuthService).currentUser$.pipe(
      map((user) => {
        if (!user) return false;

        return user.roles.some((role) => roles.includes(role));
      }),
    );
  };
};
