import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { hasRoleGuard } from '@app/core/guards/has-role.guard';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [hasRoleGuard(['SUPER_ADMIN'])],
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'collaborators',
    canActivate: [hasRoleGuard(['SUPER_ADMIN'])],
    loadComponent: () =>
      import('./collaborators/collaborators.component').then(m => m.CollaboratorsComponent),
  },
  {
    path: 'companies/businesses',
    canActivate: [hasRoleGuard(['SUPER_ADMIN', 'ADMIN'])],
    loadComponent: () =>
      import('./companies/businesses/businesses.component').then(m => m.BusinessesComponent),
  },
  {
    path: 'companies/business-types',
    canActivate: [hasRoleGuard(['SUPER_ADMIN', 'ADMIN'])],
    loadComponent: () =>
      import('./companies/business-types/business-types.component').then(
        m => m.BusinessTypesComponent
      ),
  },
  {
    path: 'geography/countries',
    canActivate: [hasRoleGuard(['SUPER_ADMIN', 'ADMIN'])],
    loadComponent: () =>
      import('./geography/countries/countries.component').then(m => m.CountriesComponent),
  },
  {
    path: 'geography/countries/departments/:id_country',
    canActivate: [hasRoleGuard(['SUPER_ADMIN', 'ADMIN'])],
    loadComponent: () =>
      import('./geography/departments/departments.component').then(m => m.DepartmentsComponent),
  },
  {
    path: 'geography/countries/departments/municipalities/:id_department',
    canActivate: [hasRoleGuard(['SUPER_ADMIN', 'ADMIN'])],
    loadComponent: () =>
      import('./geography/municipalities/municipalities.component').then(
        m => m.MunicipalitiesComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
