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

import { BusinessTypeService } from './business-types.service';

@Component({
  standalone: true,
  selector: 'app-company-types',
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
  templateUrl: './business-types.component.html',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class BusinessTypesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _companyTypesService = inject(BusinessTypeService);

  columns = [
    { key: 'name', label: 'Nombre', width: '50%' },
    { key: 'description', label: 'Descripción', width: '40%' },
  ];

  data: any[] = [];
  selectedCompanyType: any = null;
  isModalOpen = false;
  isConfirmationOpen = false;

  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  actions = [
    { label: 'Editar', callback: (row: any) => this.onEditCompanyType(row) },
    { label: 'Eliminar', callback: (row: any) => this.onDeleteCompanyType(row) },
  ];

  ngOnInit() {
    this.loadCompanyTypes();
  }

  loadCompanyTypes() {
    this._companyTypesService.getCompanyTypes().subscribe({
      next: (response: any) => (this.data = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar los tipos de empresa.'),
    });
  }

  onEditCompanyType(companyType: any) {
    this.selectedCompanyType = companyType;
    this.isModalOpen = true;

    this.form.patchValue(companyType);
  }

  onDeleteCompanyType(companyType: any) {
    this.selectedCompanyType = companyType;

    this.isConfirmationOpen = true;
  }

  onCreateCompanyType() {
    this.selectedCompanyType = null;
    this.isModalOpen = true;

    this.form.reset();
  }

  onModalClose() {
    this.selectedCompanyType = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  onConfirmAction() {
    const request = this.selectedCompanyType
      ? this._companyTypesService.updateCompanyType(
          this.selectedCompanyType.id,
          this.form.getRawValue()
        )
      : this._companyTypesService.createCompanyType(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedCompanyType
            ? `${this.selectedCompanyType.name} ha sido actualizado.`
            : 'Tipo de empresa creado con éxito.'
        );
        this.loadCompanyTypes();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
    });
  }

  onConfirmDeletion() {
    this._companyTypesService.deleteCompanyType(this.selectedCompanyType.id).subscribe({
      next: () => {
        toast.success('Tipo de empresa eliminado con éxito.');
        this.loadCompanyTypes();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error al eliminar el tipo de empresa.'),
    });
  }
}
