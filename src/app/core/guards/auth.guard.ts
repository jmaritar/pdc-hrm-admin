import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from '@modules/auth/data-access/auth.service';

// export const authGuard: CanMatchFn = (route, segments): MaybeAsync<GuardResult> => {
//   const router = inject(Router);

//   return inject(AuthService).currentUser$.pipe(
//     map(user => {
//       if (user) {
//         return true;
//       }

//       return router.createUrlTree(['/auth/sign-in']);
//     })
//   );
// };

export const authGuard: CanMatchFn = (route, segments): MaybeAsync<GuardResult> => {
  return true;
};
