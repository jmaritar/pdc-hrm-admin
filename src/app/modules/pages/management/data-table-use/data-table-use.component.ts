import { Component } from '@angular/core';

import { DataTableColumnHeaderComponent } from '@app/shared/components/data-table/components/data-table-column-header/data-table-column-header.component';
import { TableCheckboxCellComponent } from '@app/shared/components/data-table/components/table-checkbox-cell/table-checkbox-cell.component';
import { TableCheckboxHeaderComponent } from '@app/shared/components/data-table/components/table-checkbox-header/table-checkbox-header.component';
import { ColumnDef } from '@tanstack/angular-table';

import { DataTableComponent } from '@components/data-table/data-table.component';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  { firstName: 'tandy', lastName: 'miller', age: 40, visits: 40, status: 'Single', progress: 80 },
  { firstName: 'joe', lastName: 'dirte', age: 45, visits: 20, status: 'Complicated', progress: 10 },
  { firstName: 'emily', lastName: 'clark', age: 29, visits: 75, status: 'Married', progress: 60 },
  { firstName: 'michael', lastName: 'smith', age: 32, visits: 50, status: 'Single', progress: 90 },
  {
    firstName: 'sarah',
    lastName: 'johnson',
    age: 27,
    visits: 110,
    status: 'In Relationship',
    progress: 40,
  },
  {
    firstName: 'daniel',
    lastName: 'lee',
    age: 35,
    visits: 30,
    status: 'Complicated',
    progress: 30,
  },
  {
    firstName: 'olivia',
    lastName: 'martinez',
    age: 26,
    visits: 90,
    status: 'Married',
    progress: 70,
  },
  { firstName: 'kevin', lastName: 'brown', age: 38, visits: 25, status: 'Single', progress: 85 },
  {
    firstName: 'amanda',
    lastName: 'davis',
    age: 33,
    visits: 55,
    status: 'In Relationship',
    progress: 65,
  },
  {
    firstName: 'steven',
    lastName: 'wilson',
    age: 31,
    visits: 95,
    status: 'Complicated',
    progress: 20,
  },
  { firstName: 'jessica', lastName: 'moore', age: 28, visits: 120, status: 'Single', progress: 75 },
  { firstName: 'chris', lastName: 'taylor', age: 37, visits: 35, status: 'Married', progress: 55 },
  {
    firstName: 'laura',
    lastName: 'anderson',
    age: 30,
    visits: 80,
    status: 'In Relationship',
    progress: 45,
  },
  { firstName: 'ryan', lastName: 'thomas', age: 34, visits: 60, status: 'Single', progress: 95 },
  {
    firstName: 'elizabeth',
    lastName: 'jackson',
    age: 29,
    visits: 85,
    status: 'Complicated',
    progress: 35,
  },
  { firstName: 'jason', lastName: 'white', age: 36, visits: 20, status: 'Married', progress: 50 },
  { firstName: 'megan', lastName: 'harris', age: 25, visits: 130, status: 'Single', progress: 80 },
  {
    firstName: 'nathan',
    lastName: 'clark',
    age: 39,
    visits: 45,
    status: 'In Relationship',
    progress: 60,
  },
  {
    firstName: 'rachel',
    lastName: 'young',
    age: 28,
    visits: 105,
    status: 'Complicated',
    progress: 25,
  },
  { firstName: 'brian', lastName: 'king', age: 30, visits: 70, status: 'Single', progress: 85 },
  {
    firstName: 'ashley',
    lastName: 'wright',
    age: 27,
    visits: 115,
    status: 'Married',
    progress: 65,
  },
  {
    firstName: 'josh',
    lastName: 'hall',
    age: 32,
    visits: 40,
    status: 'In Relationship',
    progress: 55,
  },
  {
    firstName: 'victoria',
    lastName: 'allen',
    age: 31,
    visits: 90,
    status: 'Complicated',
    progress: 35,
  },
  { firstName: 'david', lastName: 'lopez', age: 29, visits: 100, status: 'Single', progress: 95 },
  {
    firstName: 'katherine',
    lastName: 'gonzalez',
    age: 35,
    visits: 30,
    status: 'Married',
    progress: 50,
  },
  {
    firstName: 'samuel',
    lastName: 'nelson',
    age: 33,
    visits: 60,
    status: 'In Relationship',
    progress: 75,
  },
  {
    firstName: 'isabella',
    lastName: 'roberts',
    age: 26,
    visits: 125,
    status: 'Complicated',
    progress: 20,
  },
  { firstName: 'ethan', lastName: 'carter', age: 37, visits: 50, status: 'Single', progress: 80 },
  {
    firstName: 'sophia',
    lastName: 'mitchell',
    age: 28,
    visits: 85,
    status: 'Married',
    progress: 40,
  },
];

const defaultColumns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: () => TableCheckboxHeaderComponent,
    cell: () => TableCheckboxCellComponent,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: () => 'First Name',
    cell: info => `<strong>${info.getValue()}</strong>`,
  },
  {
    accessorKey: 'lastName',
    header: () => DataTableColumnHeaderComponent,
  },
  {
    accessorKey: 'age',
    header: () => DataTableColumnHeaderComponent,
  },
  {
    accessorKey: 'visits',
    header: () => 'Visits',
  },
  {
    accessorKey: 'status',
    header: () => 'Status',
  },
  {
    accessorKey: 'progress',
    header: () => 'Profile Progress',
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: info =>
      `<button class="btn btn-primary" (click)="selectRow(${info.row.index})">View</button>`,
  },
];

@Component({
  selector: 'app-data-table-use',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './data-table-use.component.html',
})
export class DataTableUseComponent {
  defaultData = defaultData;
  defaultColumns = defaultColumns;

  handleRowSelected(row: Person) {
    console.log('Selected Row:', row);
  }

  handleNewEntry() {
    console.log('El usuario quiere agregar un nuevo elemento.');
  }

  handleEdit(row: Person) {
    console.log('El usuario quiere editar el elemento:', row);
  }

  handleDelete(row: Person) {
    console.log('El usuario quiere eliminar el elemento:', row);
  }

  handleDisable(row: Person) {
    console.log('El usuario quiere ordenar por la columna:', row);
  }
}
