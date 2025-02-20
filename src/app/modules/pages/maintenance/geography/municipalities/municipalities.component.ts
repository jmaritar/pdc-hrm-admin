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

import { MunicipalityService } from './municipalities.service';

@Component({
  standalone: true,
  selector: 'app-municipalities',
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
  templateUrl: './municipalities.component.html',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class MunicipalitiesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _municipalityService = inject(MunicipalityService);

  columns = [
    { key: 'name', label: 'Nombre', width: '50%' },
    { key: 'department', label: 'Departamento', width: '50%' },
  ];

  data: any[] = [];
  selectedMunicipality: any = null;
  isModalOpen = false;
  isConfirmationOpen = false;

  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    department_id: ['', Validators.required],
  });

  departments: any[] = [];

  actions = [
    { label: 'Editar', callback: (row: any) => this.onEditMunicipality(row) },
    { label: 'Eliminar', callback: (row: any) => this.onDeleteMunicipality(row) },
  ];

  ngOnInit() {
    this.loadMunicipalities();
    this.loadDepartments();
  }

  loadMunicipalities() {
    this._municipalityService.getMunicipalities().subscribe({
      next: (response: any) => (this.data = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar las municipalidades.'),
    });
  }

  loadDepartments() {
    this._municipalityService.getDepartments().subscribe({
      next: (response: any) => (this.departments = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar los departamentos.'),
    });
  }

  get selectedDepartmentLabel(): string {
    return (
      this.departments.find(dep => dep.id === this.form.get('department_id')?.value)?.name ||
      'Selecciona un departamento'
    );
  }

  onEditMunicipality(municipality: any) {
    this.selectedMunicipality = municipality;
    this.isModalOpen = true;

    this.form.patchValue({ ...municipality });
  }

  onDeleteMunicipality(municipality: any) {
    this.selectedMunicipality = municipality;
    this.isConfirmationOpen = true;
  }

  onCreateMunicipality() {
    this.selectedMunicipality = null;
    this.isModalOpen = true;
    this.form.reset({ name: '', department_id: '' });
  }

  onModalClose() {
    this.selectedMunicipality = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  onConfirmAction() {
    const request = this.selectedMunicipality
      ? this._municipalityService.updateMunicipality(this.selectedMunicipality.id, this.form.value)
      : this._municipalityService.createMunicipality(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedMunicipality
            ? `${this.selectedMunicipality.name} ha sido actualizado.`
            : 'Municipalidad creada con éxito.'
        );
        this.loadMunicipalities();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
    });
  }

  onConfirmDeletion() {
    this._municipalityService.deleteMunicipality(this.selectedMunicipality.id).subscribe({
      next: () => {
        toast.success('Municipalidad eliminada con éxito.');
        this.loadMunicipalities();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error al eliminar la municipalidad.'),
    });
  }
}
