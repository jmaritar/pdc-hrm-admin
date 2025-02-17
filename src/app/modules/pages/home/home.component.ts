import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private readonly _router: Router) {}

  user = {
    name: 'Administrador',
  };

  stats = {
    totalEmployees: 120,
    totalCompanies: 15,
    activeEmployees: 95,
  };

  logs = [
    { message: 'Nuevo empleado registrado: Juan Pérez', date: '2025-02-17' },
    { message: 'Empresa ABC actualizó su información', date: '2025-02-16' },
    { message: 'Se desactivó el empleado María Gómez', date: '2025-02-15' },
  ];

  onClickEmployee() {
    this._router.navigateByUrl('/maintenance/collaborators');
  }

  onClickCompany() {
    this._router.navigateByUrl('/maintenance/companies/businesses');
  }

  onClickGeographic() {
    this._router.navigateByUrl('/maintenance/geography/countries');
  }
}
