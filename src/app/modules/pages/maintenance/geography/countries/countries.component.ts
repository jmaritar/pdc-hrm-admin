import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

import { BadgeDepartmentsComponent } from './components/badge-departments/badge-departments.component';
import { CountryService } from './countries.service';

@Component({
  standalone: true,
  selector: 'app-countries',
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
    NgIcon,
    HlmIconDirective,
    HlmFormFieldModule,
    HlmButtonDirective,
    HlmBreadcrumbDirective,
    HlmBreadcrumbItemDirective,
    HlmBreadcrumbLinkDirective,
    HlmBreadcrumbListDirective,
    HlmBreadcrumbSeparatorComponent,
  ],
  templateUrl: './countries.component.html',

  providers: [
    provideIcons({ lucideLoader, lucideHouse, lucideEarth, lucideMap }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class CountriesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _countryService = inject(CountryService);

  data: any[] = [];
  selectedCountry: any = null;
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;

  // ✅ Formulario de creación/edición de país
  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.maxLength(3)]],
  });

  // ✅ Configuración del DataTable con eventos de acción
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
      accessorKey: 'count_departments',
      header: () => 'Departamentos',
      cell: () => BadgeDepartmentsComponent,
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
    this.loadCountries();
  }

  /** 📌 Carga inicial de datos */
  loadCountries() {
    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._countryService.getCountries().subscribe({
      next: (response: any) => {
        this.data = response.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar los países.');
      },
    });
  }

  /** 📌 Abre el modal para crear o editar */
  openModal(country: any = null) {
    this.selectedCountry = country;
    this.isModalOpen = true;

    if (country) {
      this.form.patchValue(country);
    } else {
      this.form.reset({ name: '', code: '' });
    }
  }

  /** 📌 Abre el diálogo de confirmación para activar/desactivar */
  openConfirmationDialog(country: any) {
    this.selectedCountry = country;
    this.isConfirmationOpen = true;
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.selectedCountry = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  /** 📌 Guarda o actualiza un país */
  saveCountry() {
    this.isSubmitting = true;

    const request = this.selectedCountry
      ? this._countryService.updateCountry(this.selectedCountry.id_country, this.form.value)
      : this._countryService.createCountry(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedCountry
            ? `${this.selectedCountry.name} ha sido actualizado.`
            : 'País creado con éxito.'
        );
        this.loadCountries();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Activa o desactiva un país */
  toggleCountryStatus() {
    if (!this.selectedCountry) return;

    this.isSubmitting = true;
    const action = this.selectedCountry.is_active ? 'desactivar' : 'activar';

    this._countryService.deactivateCountry(this.selectedCountry.id_country).subscribe({
      next: () => {
        toast.success(`País ${this.selectedCountry.name} ha sido ${action}do.`);
        this.loadCountries();
        this.closeModals();
      },
      error: error => toast.error(error.message || `Error al ${action} el país.`),
      complete: () => (this.isSubmitting = false),
    });
  }
}
