import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
} from '@tanstack/angular-table';

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
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => `<i>${info.getValue<string>()}</i>`,
    header: () => `<span>Last Name</span>`,
    footer: info => info.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: info => info.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => `<span>Visits</span>`,
    footer: info => info.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: info => info.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: info => info.column.id,
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlexRenderDirective],
  templateUrl: `
  <div class="p-2">
  <table>
    <thead>
      @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
        <tr>
          @for (header of headerGroup.headers; track header.id) {
            @if (!header.isPlaceholder) {
              <th>
                <ng-container
                  *flexRender="
                    header.column.columnDef.header;
                    props: header.getContext();
                    let header
                  "
                >
                  <div [innerHTML]="header"></div>
                </ng-container>
              </th>
            }
          }
        </tr>
      }
    </thead>
    <tbody>
      @for (row of table.getRowModel().rows; track row.id) {
        <tr>
          @for (cell of row.getVisibleCells(); track cell.id) {
            <td>
              <ng-container
                *flexRender="
                  cell.column.columnDef.cell;
                  props: cell.getContext();
                  let cell
                "
              >
                <div [innerHTML]="cell"></div>
              </ng-container>
            </td>
          }
        </tr>
      }
    </tbody>
    <tfoot>
      @for (footerGroup of table.getFooterGroups(); track footerGroup.id) {
        <tr>
          @for (footer of footerGroup.headers; track footer.id) {
            <th>
              <ng-container
                *flexRender="
                  footer.column.columnDef.footer;
                  props: footer.getContext();
                  let footer
                "
              >
                {{ footer }}
              </ng-container>
            </th>
          }
        </tr>
      }
    </tfoot>
  </table>

  <div class="h-4"></div>
  <button (click)="rerender()" class="border p-2">Rerender</button>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  data = signal<Person[]>(defaultData);

  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  }));

  rerender() {
    this.data.set([...defaultData.sort(() => -1)]);
  }
}
