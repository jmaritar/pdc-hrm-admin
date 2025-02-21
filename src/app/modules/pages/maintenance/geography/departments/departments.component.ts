import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEarth, lucideHouse, lucideLoader, lucideMap } from '@ng-icons/lucide';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import {
  HlmBreadcrumbDirective,
  HlmBreadcrumbItemDirective,
  HlmBreadcrumbLinkDirective,
  HlmBreadcrumbListDirective,
  HlmBreadcrumbPageDirective,
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

import { BadgeMunicipalitiesComponent } from './components/badge-municipalities/badge-municipalities.component';
import { DepartmentService } from './departments.service';

@Component({
  standalone: true,
  selector: 'app-departments',
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
    HlmBreadcrumbPageDirective,
    HlmBreadcrumbSeparatorComponent,

    NgIcon,
    HlmIconDirective,
  ],
  templateUrl: './departments.component.html',
  providers: [
    provideIcons({ lucideLoader, lucideHouse, lucideEarth, lucideMap }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class DepartmentsComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);

  data: any[] = [];
  selectedDepartment: any = null;
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;
  countryId: string | null = null;
  countryName: string | null = null;

  // ✅ Formulario de creación/edición de departamento
  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
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
      accessorKey: 'name',
      header: () => DataTableColumnHeaderComponent,
      cell: info => `<strong>${info.getValue()}</strong>`,
      size: 250,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'is_active',
      header: () => 'Estado',
      cell: info => `
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
        >
          ${info.getValue() ? 'Activo' : 'Inactivo'}
        </span>
      `,
      size: 100,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'count_municipalities',
      header: () => 'Departamentos',
      cell: () => BadgeMunicipalitiesComponent,
      size: 150,
      meta: { align: 'center' },
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
    this.countryId = this.route.snapshot.paramMap.get('id_country');
    this.route.queryParams.subscribe(params => {
      this.countryName = params['name'] || 'Desconocido';
    });

    if (!this.countryId) {
      toast.error('No se ha especificado un país válido.');
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.loadDepartments();
  }

  /** 📌 Carga inicial de datos */
  loadDepartments() {
    if (!this.countryId) return;

    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._departmentService.getDepartmentByIdCountry(this.countryId).subscribe({
      next: (response: any) => {
        // Si la respuesta tiene un error 404, cargamos un array vacío
        if (response?.statusCode === 404) {
          this.data = [];
        } else {
          this.data = response.data ?? [];
        }
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        // Verificamos si es error 404 para no marcarlo como error
        if (error?.status === 404) {
          this.data = [];
          this.isLoading = false;
          this.isDataLoaded = true;
        } else {
          this.hasError = true;
          this.isLoading = false;
          this.isDataLoaded = false;
          toast.error(error.message || 'Hubo un error al cargar los departamentos.');
        }
      },
    });
  }

  /** 📌 Abre el modal para crear o editar */
  openModal(department: any = null) {
    this.selectedDepartment = department;
    this.isModalOpen = true;

    if (department) {
      this.form.patchValue(department);
    } else {
      this.form.reset({ name: '', code: '' });
    }
  }

  /** 📌 Abre el diálogo de confirmación para activar/desactivar */
  openConfirmationDialog(department: any) {
    this.selectedDepartment = department;
    this.isConfirmationOpen = true;
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.selectedDepartment = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  /** 📌 Guarda o actualiza un departamento */
  saveDepartment() {
    this.isSubmitting = true;

    const request = this.selectedDepartment
      ? this._departmentService.updateDepartment(
          this.selectedDepartment.id_department,
          this.form.value
        )
      : this._departmentService.createDepartment({
          ...this.form.value,
          country_id: this.countryId,
        });

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedDepartment
            ? `${this.selectedDepartment.name} ha sido actualizado.`
            : 'Departamento creado con éxito.'
        );
        this.loadDepartments();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Activa o desactiva un departamento */
  toggleDepartmentStatus() {
    if (!this.selectedDepartment) return;

    this.isSubmitting = true;
    const action = this.selectedDepartment.is_active ? 'desactivar' : 'activar';

    this._departmentService.deactivateDepartment(this.selectedDepartment.id_department).subscribe({
      next: () => {
        toast.success(`Departamento ${this.selectedDepartment.name} ha sido ${action}do.`);
        this.loadDepartments();
        this.closeModals();
      },
      error: error => toast.error(error.message || `Error al ${action} el departamento.`),
      complete: () => (this.isSubmitting = false),
    });
  }
}
