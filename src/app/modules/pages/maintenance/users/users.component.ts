import { Component } from '@angular/core';

import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';

import { ButtonComponent } from '@components/button/button.component';

@Component({
  selector: 'app-users',
  imports: [ButtonComponent, DataTableComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {}
