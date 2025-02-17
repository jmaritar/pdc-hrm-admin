import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'maintenance',
        loadChildren: () =>
          import('../pages/maintenance/maintenance.module').then(m => m.MaintenanceModule),
      },
      {
        path: 'management',
        loadChildren: () =>
          import('../pages/management/management.module').then(m => m.ManagementModule),
      },
      {
        path: 'user',
        loadComponent: () => import('../pages/user/user.component').then(m => m.UserComponent),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
