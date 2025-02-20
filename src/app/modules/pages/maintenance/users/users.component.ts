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

import { UserService } from './user.service';

@Component({
  standalone: true,
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class UsersComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _userService = inject(UserService);

  columns = [
    { key: 'name', label: 'Nombre', width: '25%' },
    { key: 'email', label: 'Correo', width: '30%' },
    { key: 'role', label: 'Rol', width: '20%' },
  ];

  data: any[] = [];
  selectedUser: any = null;
  isModalOpen = false;
  isConfirmationOpen = false;

  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['HR', Validators.required],
  });

  roles = [
    { value: 'SUPER_ADMIN', label: 'Administrador General' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'HR', label: 'Recursos Humanos' },
  ];

  actions = [
    { label: 'Editar', callback: (row: any) => this.onEditUser(row) },
    { label: 'Desactivar', callback: (row: any) => this.onDeactivateUser(row) },
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this._userService.getUsers().subscribe({
      next: (response: any) => (this.data = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar los usuarios.'),
    });
  }

  get selectedRoleLabel(): string {
    return (
      this.roles.find(role => role.value === this.form.get('role')?.value)?.label ||
      'Selecciona un rol'
    );
  }

  onEditUser(user: any) {
    this.selectedUser = user;
    this.isModalOpen = true;

    this.form.patchValue({ ...user, password: '', role: user.role ?? 'HR' });
    this.form.controls['email'].disable();
  }

  onDeactivateUser(user: any) {
    this.selectedUser = user;

    this.isConfirmationOpen = true;
  }

  onCreateUser() {
    this.selectedUser = null;
    this.isModalOpen = true;

    this.form.reset({ name: '', email: '', password: '', role: 'HR' });
    this.form.controls['email'].enable();
  }

  onModalClose() {
    this.selectedUser = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  onConfirmAction() {
    const request = this.selectedUser
      ? this._userService.updateUser(this.selectedUser.id_user, this.form.getRawValue())
      : this._userService.createUser(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedUser
            ? `${this.selectedUser.name} ha sido actualizado.`
            : 'Usuario creado con éxito.'
        );
        this.loadUsers();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
    });
  }

  onConfirmDeactivation() {
    this._userService.deactivateUser(this.selectedUser.id_user).subscribe({
      next: () => {
        toast.success('Usuario desactivado con éxito.');
        this.loadUsers();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error al desactivar el usuario.'),
    });
  }
}
