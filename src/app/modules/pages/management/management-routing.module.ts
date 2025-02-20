import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'audit-logs',
    loadComponent: () =>
      import('./audit-logs/audit-logs.component').then(m => m.AuditLogsComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
  },
  {
    path: 'data-table-use',
    loadComponent: () =>
      import('./data-table-use/data-table-use.component').then(m => m.DataTableUseComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
