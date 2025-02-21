import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClock,
  lucideFileText,
  lucideList,
  lucideLoader,
  lucideUsers,
} from '@ng-icons/lucide';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import {
  HlmBreadcrumbDirective,
  HlmBreadcrumbItemDirective,
  HlmBreadcrumbLinkDirective,
  HlmBreadcrumbListDirective,
  HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ColumnDef } from '@tanstack/angular-table';
import { toast } from 'ngx-sonner';

import { AuditLogsService } from './audit-logs.service';

@Component({
  standalone: true,
  selector: 'app-audit-logs',
  imports: [
    CommonModule,
    DataTableComponent,
    HlmBreadcrumbDirective,
    HlmBreadcrumbItemDirective,
    HlmBreadcrumbLinkDirective,
    HlmBreadcrumbListDirective,
    HlmBreadcrumbSeparatorComponent,
    HlmButtonDirective,
    NgIcon,
  ],
  templateUrl: './audit-logs.component.html',
  providers: [
    provideIcons({
      lucideLoader,
      lucideList,
      lucideFileText,
      lucideUsers,
      lucideClock,
    }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class AuditLogsComponent implements OnInit {
  private _auditLogsService = inject(AuditLogsService);

  data: any[] = [];
  isLoading = true;
  hasError = false;
  isDataLoaded = false;

  // ✅ Configuración del DataTable
  columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: () => TableCheckboxHeaderComponent,
      cell: () => TableCheckboxCellComponent,
      enableSorting: false,
      enableHiding: false,
      size: 50,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'created_at',
      header: () => DataTableColumnHeaderComponent,
      cell: info => new Date(info.getValue() as string | number).toLocaleString(),
      size: 180,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'user_id',
      header: () => 'Usuario',
      cell: info => info.getValue() ?? 'Desconocido',
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'table_name',
      header: () => 'Tabla',
      cell: info => info.getValue(),
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'action',
      header: () => 'Acción',
      cell: info => `
        <span class="px-2 py-1 rounded-full text-xs font-medium
          ${info.getValue() === 'CREATE' ? 'bg-green-100 text-green-800' : ''}
          ${info.getValue() === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${info.getValue() === 'DELETE' ? 'bg-red-100 text-red-800' : ''}
          ${info.getValue() === 'DEACTIVATE' ? 'bg-gray-100 text-gray-800' : ''}
        ">
          ${info.getValue()}
        </span>
      `,
      size: 120,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'ip_address',
      header: () => 'IP',
      cell: info => info.getValue() ?? 'No disponible',
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'device_info',
      header: () => 'Dispositivo',
      cell: info => info.getValue() ?? 'No especificado',
      size: 200,
      meta: { align: 'center' },
    },
  ];

  ngOnInit() {
    this.loadAuditLogs();
  }

  /** 📌 Carga los logs de auditoría */
  loadAuditLogs() {
    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._auditLogsService.getAllLogs().subscribe({
      next: (response: any) => {
        this.data = response?.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar los logs de auditoría.');
      },
    });
  }
}
