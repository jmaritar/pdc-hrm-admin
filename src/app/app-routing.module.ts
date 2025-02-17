import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { privateGuard, publicGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard()],
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    canActivate: [privateGuard()],
    loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule),
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
