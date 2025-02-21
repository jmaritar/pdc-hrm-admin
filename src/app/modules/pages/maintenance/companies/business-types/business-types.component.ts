import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBuilding, lucideLoader } from '@ng-icons/lucide';
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
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ColumnDef } from '@tanstack/angular-table';
import { toast } from 'ngx-sonner';

import { BusinessTypeService } from './business-types.service';

@Component({
  standalone: true,
  selector: 'app-business-types',
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
    NgIcon,
    HlmIconDirective,
  ],
  templateUrl: './business-types.component.html',
  providers: [
    provideIcons({ lucideLoader, lucideBuilding }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class BusinessTypesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _businessTypeService = inject(BusinessTypeService);

  data: any[] = [];
  selectedBusinessType: any = null;
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;

  // ✅ Formulario de creación/edición de tipo de empresa
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
      id: 'actions',
      header: () => 'Acciones',
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: { align: 'right' },
    },
  ];

  ngOnInit() {
    this.loadBusinessTypes();
  }

  /** 📌 Carga inicial de datos */
  loadBusinessTypes() {
    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._businessTypeService.getCompanyTypes().subscribe({
      next: (response: any) => {
        this.data = response?.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar los tipos de empresa.');
      },
    });
  }

  /** 📌 Abre el modal para crear o editar */
  openModal(businessType: any = null) {
    this.selectedBusinessType = businessType;
    this.isModalOpen = true;

    if (businessType) {
      this.form.patchValue(businessType);
    } else {
      this.form.reset({ name: '' });
    }
  }

  /** 📌 Abre el diálogo de confirmación para eliminar */
  openConfirmationDialog(businessType: any) {
    this.selectedBusinessType = businessType;
    this.isConfirmationOpen = true;
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.selectedBusinessType = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  /** 📌 Guarda o actualiza un tipo de empresa */
  saveBusinessType() {
    this.isSubmitting = true;

    const request = this.selectedBusinessType
      ? this._businessTypeService.updateCompanyType(
          this.selectedBusinessType.id_company_type,
          this.form.value
        )
      : this._businessTypeService.createCompanyType(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedBusinessType
            ? `${this.selectedBusinessType.name} ha sido actualizado.`
            : 'Tipo de empresa creado con éxito.'
        );
        this.loadBusinessTypes();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Elimina un tipo de empresa */
  deleteBusinessType() {
    if (!this.selectedBusinessType) return;

    this.isSubmitting = true;

    this._businessTypeService
      .deleteCompanyType(this.selectedBusinessType.id_company_type)
      .subscribe({
        next: () => {
          toast.success(`Tipo de empresa ${this.selectedBusinessType.name} eliminado.`);
          this.loadBusinessTypes();
          this.closeModals();
        },
        error: error => toast.error(error.message || 'Error al eliminar el tipo de empresa.'),
        complete: () => (this.isSubmitting = false),
      });
  }
}
