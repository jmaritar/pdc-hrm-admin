import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { hasRoleGuard } from '@app/core/guards/has-role.guard';

const routes: Routes = [
  {
    path: 'user',
    canActivate: [hasRoleGuard(['SUPER_ADMIN'])],
    loadComponent: () => import('./user.component').then(m => m.UserComponent),
  },
  {
    path: 'user/:id_country',
    canActivate: [hasRoleGuard(['SUPER_ADMIN'])],
    loadComponent: () =>
      import('./user-companies/user-companies.component').then(m => m.UserCompaniesComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
