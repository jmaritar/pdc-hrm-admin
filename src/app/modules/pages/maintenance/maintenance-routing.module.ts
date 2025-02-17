import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'collaborators',
    loadComponent: () =>
      import('./collaborators/collaborators.component').then(m => m.CollaboratorsComponent),
  },
  {
    path: 'companies/businesses',
    loadComponent: () =>
      import('./companies/businesses/businesses.component').then(m => m.BusinessesComponent),
  },
  {
    path: 'companies/business-types',
    loadComponent: () =>
      import('./companies/business-types/business-types.component').then(
        m => m.BusinessTypesComponent
      ),
  },
  {
    path: 'geography/countries',
    loadComponent: () =>
      import('./geography/countries/countries.component').then(m => m.CountriesComponent),
  },
  {
    path: 'geography/departments',
    loadComponent: () =>
      import('./geography/departments/departments.component').then(m => m.DepartmentsComponent),
  },
  {
    path: 'geography/municipalities',
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
