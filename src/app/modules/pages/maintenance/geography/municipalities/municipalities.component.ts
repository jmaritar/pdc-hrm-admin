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
  lucideEarth,
  lucideHouse,
  lucideLoader,
  lucideMap,
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

import { MunicipalityService } from './municipalities.service';

@Component({
  standalone: true,
  selector: 'app-municipalities',
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
  templateUrl: './municipalities.component.html',
  providers: [
    provideIcons({ lucideLoader, lucideHouse, lucideMap, lucideBuilding, lucideEarth }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class MunicipalitiesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _municipalityService = inject(MunicipalityService);
  private route = inject(ActivatedRoute);

  data: any[] = [];
  selectedMunicipality: any = null;
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;
  departmentId: string | null = null;
  departmentName: string | null = null;

  // ✅ Formulario de creación/edición de municipalidad
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
      id: 'actions',
      header: () => 'Acciones',
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: { align: 'right' },
    },
  ];

  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('id_department');
    this.route.queryParams.subscribe(params => {
      this.departmentName = params['name'] || 'Desconocido';
    });

    if (!this.departmentId) {
      toast.error('No se ha especificado un departamento válido.');
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.loadMunicipalities();
  }

  /** 📌 Carga inicial de datos */
  loadMunicipalities() {
    if (!this.departmentId) return;

    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._municipalityService.getMunicipalityByIdDepartment(this.departmentId).subscribe({
      next: (response: any) => {
        this.data = response?.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar las municipalidades.');
      },
    });
  }

  /** 📌 Abre el modal para crear o editar */
  openModal(municipality: any = null) {
    this.selectedMunicipality = municipality;
    this.isModalOpen = true;

    if (municipality) {
      this.form.patchValue(municipality);
    } else {
      this.form.reset({ name: '' });
    }
  }

  /** 📌 Abre el diálogo de confirmación para activar/desactivar */
  openConfirmationDialog(municipality: any) {
    this.selectedMunicipality = municipality;
    this.isConfirmationOpen = true;
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.selectedMunicipality = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  /** 📌 Guarda o actualiza una municipalidad */
  saveMunicipality() {
    this.isSubmitting = true;

    const request = this.selectedMunicipality
      ? this._municipalityService.updateMunicipality(
          this.selectedMunicipality.id_municipality,
          this.form.value
        )
      : this._municipalityService.createMunicipality({
          ...this.form.value,
          department_id: this.departmentId,
        });

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedMunicipality
            ? `${this.selectedMunicipality.name} ha sido actualizado.`
            : 'Municipalidad creada con éxito.'
        );
        this.loadMunicipalities();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Activa o desactiva una municipalidad */
  toggleMunicipalityStatus() {
    if (!this.selectedMunicipality) return;

    this.isSubmitting = true;
    const action = this.selectedMunicipality.is_active ? 'desactivar' : 'activar';

    this._municipalityService
      .deactivateMunicipality(this.selectedMunicipality.id_municipality)
      .subscribe({
        next: () => {
          toast.success(`Municipalidad ${this.selectedMunicipality.name} ha sido ${action}da.`);
          this.loadMunicipalities();
          this.closeModals();
        },
        error: error => toast.error(error.message || `Error al ${action} la municipalidad.`),
        complete: () => (this.isSubmitting = false),
      });
  }
}
