import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ColumnDef } from '@tanstack/angular-table';
import { toast } from 'ngx-sonner';

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
    // HlmDialogDescriptionDirective,
    HlmInputDirective,
    HlmFormFieldModule,
    HlmButtonDirective,
    NgIcon,
  ],
  templateUrl: './departments.component.html',
  providers: [
    provideIcons({ lucideLoader }),
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

  // ✅ Formulario de creación/edición de departamento
  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.maxLength(5)]],
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
      accessorKey: 'code',
      header: () => DataTableColumnHeaderComponent,
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'created_at',
      header: () => 'Departamentos',
      cell: info => {
        const department = info.row.original; // Obtener el departamento actual
        return `
          <button
            class="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
            onclick="navigateToDepartment(${department.id_department}, '${department.name}')"
          >
            Ver departamentos
          </button>
        `;
      },
      size: 150,
      meta: { align: 'center' },
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
      id: 'actions',
      header: () => 'Acciones',
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: { align: 'right' },
    },
  ];

  ngOnInit() {
    const countryId = this.route.snapshot.paramMap.get('id_country');
    console.log('ID del país:', countryId);
    this.loadDepartments();
  }

  /** 📌 Carga inicial de datos */
  loadDepartments() {
    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._departmentService.getDepartments().subscribe({
      next: (response: any) => {
        this.data = response.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar los departamentos.');
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
      : this._departmentService.createDepartment(this.form.value);

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
