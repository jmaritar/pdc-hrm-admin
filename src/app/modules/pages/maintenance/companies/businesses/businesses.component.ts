import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { toast } from 'ngx-sonner';

import { BusinessesService } from './businesses.service';

@Component({
  standalone: true,
  selector: 'app-companies',
  imports: [
    // DataTableComponent,
    ReactiveFormsModule,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmInputDirective,
    HlmFormFieldModule,
    HlmSelectModule,
    HlmButtonDirective,
    HlmSelectImports,
    BrnSelectImports,
  ],
  templateUrl: './businesses.component.html',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class BusinessesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _companiesService = inject(BusinessesService);

  columns = [
    { key: 'name', label: 'Nombre', width: '25%' },
    { key: 'type', label: 'Tipo de Empresa', width: '25%' },
    { key: 'created_at', label: 'Fecha de Creación', width: '30%' },
  ];

  data: any[] = [];
  selectedCompany: any = null;
  isModalOpen = false;
  isConfirmationOpen = false;

  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
  });

  companyTypes = [
    { value: 'SME', label: 'Pequeña y Mediana Empresa' },
    { value: 'LARGE', label: 'Gran Empresa' },
  ];

  actions = [
    { label: 'Editar', callback: (row: any) => this.onEditCompany(row) },
    { label: 'Eliminar', callback: (row: any) => this.onDeleteCompany(row) },
  ];

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this._companiesService.getCompanies().subscribe({
      next: (response: any) => (this.data = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar las compañías.'),
    });
  }

  get companyTypeLabel() {
    return this.companyTypes.find(type => type.value === this.form.get('type')?.value)?.label;
  }

  onEditCompany(company: any) {
    this.selectedCompany = company;
    this.isModalOpen = true;

    this.form.patchValue(company);
  }

  onDeleteCompany(company: any) {
    this.selectedCompany = company;

    this.isConfirmationOpen = true;
  }

  onCreateCompany() {
    this.selectedCompany = null;
    this.isModalOpen = true;

    this.form.reset();
  }

  onModalClose() {
    this.selectedCompany = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  onConfirmAction() {
    const request = this.selectedCompany
      ? this._companiesService.updateCompany(this.selectedCompany.id, this.form.getRawValue())
      : this._companiesService.createCompany(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedCompany
            ? `${this.selectedCompany.name} ha sido actualizado.`
            : 'Compañía creada con éxito.'
        );
        this.loadCompanies();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
    });
  }

  onConfirmDeletion() {
    this._companiesService.deleteCompany(this.selectedCompany.id).subscribe({
      next: () => {
        toast.success('Compañía eliminada con éxito.');
        this.loadCompanies();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error al eliminar la compañía.'),
    });
  }
}
