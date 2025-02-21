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

import { BusinessesService } from './businesses.service';

@Component({
  standalone: true,
  selector: 'app-businesses',
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
  templateUrl: './businesses.component.html',
  providers: [
    provideIcons({ lucideLoader, lucideBuilding }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class BusinessesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _businessesService = inject(BusinessesService);

  data: any[] = [];
  selectedBusiness: any = null;
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;

  // Opciones para los selects
  companyTypes: any[] = [];
  countries: any[] = [];
  departments: any[] = [];
  municipalities: any[] = [];

  // ✅ Formulario de creación/edición de empresa
  form: FormGroup = this._formBuilder.group({
    legal_name: ['', Validators.required],
    trade_name: ['', Validators.required],
    nit: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    company_type_id: ['', Validators.required],
    country_id: ['', Validators.required],
    department_id: ['', Validators.required],
    municipality_id: ['', Validators.required],
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
      accessorKey: 'legal_name',
      header: () => DataTableColumnHeaderComponent,
      cell: info => info.getValue(),
      size: 150,
      meta: { align: 'center' },
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
      header: () => DataTableColumnHeaderComponent,
      cell: info => info.getValue(),
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
    this.loadCompanies();
    this.loadCompanyTypes();
    this.loadCountries();
  }

  /** 📌 Carga inicial de datos */
  loadCompanies() {
    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._businessesService.getCompanies().subscribe({
      next: (response: any) => {
        this.data = response?.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar las empresas.');
      },
    });
  }

  loadCompanyTypes() {
    this._businessesService.getCompanyTypes().subscribe(response => {
      this.companyTypes = response.data;
    });
  }

  loadCountries() {
    this._businessesService.getCountries().subscribe(response => {
      this.countries = response.data;
    });
  }

  onCountryChange() {
    const countryId = this.form.value.country_id;
    if (!countryId) return;
    this._businessesService.getDepartmentByIdCountry(countryId).subscribe(response => {
      this.departments = response.data;
      this.municipalities = [];
      this.form.patchValue({ department_id: '', municipality_id: '' });
    });
  }

  onDepartmentChange() {
    const departmentId = this.form.value.department_id;
    if (!departmentId) return;
    this._businessesService.getMunicipalityByIdDepartment(departmentId).subscribe(response => {
      this.municipalities = response.data;
      this.form.patchValue({ municipality_id: '' });
    });
  }

  /** 📌 Abre el modal para crear o editar */
  openModal(business: any = null) {
    this.selectedBusiness = business;
    this.isModalOpen = true;

    if (business) {
      this.form.patchValue(business);

      // Cargar departamentos según el país seleccionado
      this._businessesService.getDepartmentByIdCountry(business.country_id).subscribe(response => {
        this.departments = response.data;
        this.form.patchValue({ department_id: business.department_id });

        // Cargar municipios según el departamento seleccionado
        this._businessesService
          .getMunicipalityByIdDepartment(business.department_id)
          .subscribe(res => {
            this.municipalities = res.data;
            this.form.patchValue({ municipality_id: business.municipality_id });
          });
      });
    } else {
      this.form.reset();
      this.departments = [];
      this.municipalities = [];
    }
  }

  /** 📌 Abre el diálogo de confirmación para eliminar */
  openConfirmationDialog(business: any) {
    this.selectedBusiness = business;
    this.isConfirmationOpen = true;
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.selectedBusiness = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  /** 📌 Guarda o actualiza una empresa */
  saveBusiness() {
    this.isSubmitting = true;

    const request = this.selectedBusiness
      ? this._businessesService.updateCompany(this.selectedBusiness.id_company, this.form.value)
      : this._businessesService.createCompany(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedBusiness
            ? `${this.selectedBusiness.trade_name} ha sido actualizado.`
            : 'Empresa creada con éxito.'
        );
        this.loadCompanies();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Desactivar empresa */
  deactivateBusiness() {
    this.isSubmitting = true;
    this._businessesService.deactivateCompany(this.selectedBusiness.id_company).subscribe({
      next: () => {
        toast.success(`Empresa ${this.selectedBusiness.trade_name} ha sido desactivada.`);
        this.loadCompanies();
        this.closeModals();
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
