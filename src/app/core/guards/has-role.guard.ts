import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '@app/shared/data-access/auth-state.service';
import { UserRole } from 'backend';
import { toast } from 'ngx-sonner';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export const hasRoleGuard = (roles: UserRole[]): CanActivateFn => {
  return () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    const session = authStateService.getSession();

    return of(session?.user).pipe(
      map(user => {
        if (!user) {
          return false;
        }

        console.log('El usuario tiene el rol:', user.role);

        if (!roles.includes(user.role)) {
          // Si el rol no está permitido, muestra el toast de error
          toast.error('Acceso denegado', {
            description: 'No tienes permisos para acceder a esta página',
          });
          router.navigate(['/']);

          return false;
        }

        return true;
      })
    );
  };
};
