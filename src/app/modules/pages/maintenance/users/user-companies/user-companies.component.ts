import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding,
  lucideBuilding2,
  lucideHouse,
  lucideLoader,
  lucideTrash,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import {
  HlmBreadcrumbDirective,
  HlmBreadcrumbItemDirective,
  HlmBreadcrumbLinkDirective,
  HlmBreadcrumbListDirective,
  HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ColumnDef } from '@tanstack/angular-table';
import { toast } from 'ngx-sonner';

import { UserCompaniesService } from './user-companies.service';

@Component({
  standalone: true,
  selector: 'app-user-companies',
  imports: [
    CommonModule,
    DataTableComponent,
    ReactiveFormsModule,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmInputDirective,
    HlmFormFieldModule,
    HlmButtonDirective,
    HlmBreadcrumbDirective,
    HlmBreadcrumbItemDirective,
    HlmBreadcrumbLinkDirective,
    HlmBreadcrumbListDirective,
    HlmBreadcrumbSeparatorComponent,
    NgIcon,
    HlmIconDirective,
  ],
  templateUrl: './user-companies.component.html',
  providers: [
    provideIcons({
      lucideLoader,
      lucideBuilding,
      lucideUser,
      lucideTrash,
      lucideHouse,
      lucideUsers,
      lucideBuilding2,
    }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class UserCompaniesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _userCompaniesService = inject(UserCompaniesService);
  private route = inject(ActivatedRoute);

  data: any[] = [];
  companies: any[] = [];
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;
  userId: string | null = null;
  userName: string | null = null;
  selectedCompany: any = null;

  // ✅ Formulario para asignación de empresas al usuario
  form: FormGroup = this._formBuilder.group({
    company_id: ['', Validators.required],
  });

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
      accessorKey: 'trade_name',
      header: () => DataTableColumnHeaderComponent,
      cell: info => `<strong>${info.getValue()}</strong>`,
      size: 250,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'nit',
      header: () => 'NIT',
      cell: info => info.getValue(),
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'phone',
      header: () => 'Teléfono',
      cell: info => info.getValue(),
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'email',
      header: () => 'Correo Electrónico',
      cell: info => info.getValue(),
      size: 200,
      meta: { align: 'left' },
    },
    {
      id: 'actions',
      header: () => 'Acciones',
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: { align: 'right' },
    },
  ];

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id_user');
    this.route.queryParams.subscribe(params => {
      this.userName = params['name'] || 'Desconocido';
    });

    if (!this.userId) {
      toast.error('No se ha especificado un usuario válido.');
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.loadUserCompanies();
    this.loadCompanies();
  }

  /** 📌 Carga las empresas del usuario */
  loadUserCompanies() {
    if (!this.userId) return;

    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._userCompaniesService.getUserCompanies(this.userId).subscribe({
      next: (response: any) => {
        this.data = response?.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar las empresas del usuario.');
      },
    });
  }

  /** 📌 Carga todas las empresas disponibles para asignación */
  loadCompanies() {
    if (!this.userId) return;

    this._userCompaniesService.getCompaniesAvaibles(this.userId).subscribe({
      next: (response: any) => {
        this.companies = response?.data ?? [];
      },
      error: error => {
        toast.error(error.message || 'Error al cargar la lista de empresas.');
      },
    });
  }

  /** 📌 Abre el modal para asignar empresa */
  openModal() {
    this.isModalOpen = true;
    this.form.reset();
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.loadCompanies();
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
    this.selectedCompany = null;
  }

  /** 📌 Asigna un usuario a una empresa */
  assignUserToCompany() {
    if (!this.userId) return;

    this.isSubmitting = true;
    const companyId = this.form.value.company_id;

    this._userCompaniesService.assignUserToCompany(this.userId, companyId).subscribe({
      next: () => {
        toast.success('Usuario asignado correctamente a la empresa.');
        this.loadUserCompanies();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error al asignar empresa.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Abre el diálogo de confirmación antes de eliminar */
  openConfirmationDialog(company: any) {
    this.selectedCompany = company;
    this.isConfirmationOpen = true;
  }

  /** 📌 Elimina la asignación de usuario a una empresa */
  removeUserFromCompany() {
    if (!this.userId || !this.selectedCompany) return;

    this.isSubmitting = true;

    this._userCompaniesService
      .removeUserFromCompany(this.userId, this.selectedCompany.id_company)
      .subscribe({
        next: () => {
          toast.success('Usuario eliminado de la empresa.');
          this.loadUserCompanies();
          this.closeModals();
        },
        error: error => toast.error(error.message || 'Error al eliminar empresa.'),
        complete: () => (this.isSubmitting = false),
      });
  }
}
