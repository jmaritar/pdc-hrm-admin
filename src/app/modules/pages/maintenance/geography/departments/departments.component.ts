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

import { DepartmentService } from './departments.service';

@Component({
  standalone: true,
  selector: 'app-departments',
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
  templateUrl: './departments.component.html',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class DepartmentsComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _departmentService = inject(DepartmentService);

  columns = [
    { key: 'name', label: 'Nombre', width: '50%' },
    { key: 'code', label: 'Código', width: '30%' },
  ];

  data: any[] = [];
  selectedDepartment: any = null;
  isModalOpen = false;
  isConfirmationOpen = false;

  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.maxLength(5)]],
  });

  actions = [
    { label: 'Editar', callback: (row: any) => this.onEditDepartment(row) },
    { label: 'Desactivar', callback: (row: any) => this.onDeactivateDepartment(row) },
  ];

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this._departmentService.getDepartments().subscribe({
      next: (response: any) => (this.data = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar los departamentos.'),
    });
  }

  onEditDepartment(department: any) {
    this.selectedDepartment = department;
    this.isModalOpen = true;
    this.form.patchValue(department);
  }

  onDeactivateDepartment(department: any) {
    this.selectedDepartment = department;
    this.isConfirmationOpen = true;
  }

  onCreateDepartment() {
    this.selectedDepartment = null;
    this.isModalOpen = true;
    this.form.reset({ name: '', code: '' });
  }

  onModalClose() {
    this.selectedDepartment = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  onConfirmAction() {
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
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
    });
  }

  onConfirmDeactivation() {
    this._departmentService.deactivateDepartment(this.selectedDepartment.id_department).subscribe({
      next: () => {
        toast.success('Departamento desactivado con éxito.');
        this.loadDepartments();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error al desactivar el departamento.'),
    });
  }
}
