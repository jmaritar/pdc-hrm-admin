import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader, lucideUser } from '@ng-icons/lucide';
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

import { BadgeUsersCompaniesComponent } from './components/badge-users-companies/badge-users-companies.component';
import { UserService } from './user.service';

@Component({
  standalone: true,
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  providers: [
    provideIcons({ lucideLoader, lucideUser }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class UsersComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _userService = inject(UserService);

  data: any[] = [];
  selectedUser: any = null;
  isLoading = true;
  hasError = false;
  isDataLoaded = false;
  isModalOpen = false;
  isConfirmationOpen = false;
  isSubmitting = false;

  // Lista de roles
  roles = ['SUPER_ADMIN', 'ADMIN', 'HR'];

  // ✅ Formulario de creación/edición de usuario
  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required],
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
      header: () => 'Nombre',
      cell: info => `<strong>${info.getValue()}</strong>`,
      size: 200,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'email',
      header: () => 'Correo',
      cell: info => info.getValue(),
      size: 250,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'role',
      header: () => 'Rol',
      cell: info => info.getValue(),
      size: 150,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'count_companies',
      header: () => 'Empresas',
      cell: () => BadgeUsersCompaniesComponent,
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
    this.loadUsers();
  }

  /** 📌 Carga inicial de datos */
  loadUsers() {
    this.isLoading = true;
    this.hasError = false;
    this.isDataLoaded = false;

    this._userService.getUsers().subscribe({
      next: (response: any) => {
        this.data = response?.data ?? [];
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: error => {
        this.hasError = true;
        this.isLoading = false;
        this.isDataLoaded = false;
        toast.error(error.message || 'Hubo un error al cargar los usuarios.');
      },
    });
  }

  /** 📌 Abre el modal para crear o editar */
  openModal(user: any = null) {
    this.selectedUser = user;
    this.isModalOpen = true;

    if (user) {
      this.form.patchValue({
        name: user.name,
        email: user.email,
        password: '', // No se carga la contraseña
        role: user.role,
      });

      // Deshabilitar el email en edición
      this.form.get('email')?.disable();

      // La contraseña no es obligatoria en edición
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.reset();
      this.form.get('email')?.enable(); // Habilitar email en creación

      // La contraseña es obligatoria en creación
      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  /** 📌 Abre el diálogo de confirmación para eliminar */
  openConfirmationDialog(user: any) {
    this.selectedUser = user;
    this.isConfirmationOpen = true;
  }

  /** 📌 Cierra los modales */
  closeModals() {
    this.selectedUser = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  /** 📌 Guarda o actualiza un usuario */
  saveUser() {
    this.isSubmitting = true;

    const request = this.selectedUser
      ? this._userService.updateUser(this.selectedUser.id_user, this.form.value)
      : this._userService.createUser(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedUser
            ? `${this.selectedUser.name} ha sido actualizado.`
            : 'Usuario creado con éxito.'
        );
        this.loadUsers();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Activar/Desactivar usuario */
  toggleUserStatus(user: any) {
    this.isSubmitting = true;
    this._userService.toggleUserStatus(user.id_user).subscribe({
      next: () => {
        toast.success(
          `Usuario ${user.name} ha sido ${user.is_active ? 'desactivado' : 'activado'}.`
        );
        this.loadUsers();
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  /** 📌 Eliminar usuario */
  deleteUser() {
    if (!this.selectedUser) return;

    this.isSubmitting = true;
    this._userService.deleteUser(this.selectedUser.id_user).subscribe({
      next: () => {
        toast.success(`Usuario ${this.selectedUser.name} eliminado.`);
        this.loadUsers();
        this.closeModals();
      },
      error: error => toast.error(error.message || 'Error al eliminar el usuario.'),
      complete: () => (this.isSubmitting = false),
    });
  }
}
