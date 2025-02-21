import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideBan,
  lucideCloudOff,
  lucideEllipsis,
  lucidePencil,
  lucideSquarePen,
  lucideTrash2,
} from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { BrnTableModule } from '@spartan-ng/brain/table';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/angular-table';

import { DataTablePaginationComponent } from './components/data-table-pagination/data-table-pagination.component';
import { DataTableToolbarComponent } from './components/data-table-toolbar/data-table-toolbar.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    DataTableToolbarComponent,
    DataTablePaginationComponent,
    FlexRenderDirective,
    BrnTableModule,
    HlmTableModule,
    HlmIconDirective,
    HlmButtonDirective,
    NgIcon,
    BrnMenuTriggerDirective,
    HlmMenuModule,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideEllipsis,
      lucidePencil,
      lucideTrash2,
      lucideBan,
      lucideCloudOff,
      lucideSquarePen,
    }),
  ],
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<TData> implements OnChanges {
  @Input() data: TData[] = [];
  @Input() columns: ColumnDef<TData, any>[] = [];
  @Input() filterKey: string = 'firstName'; // 🔍 Permite definir la columna a filtrar

  // 🆕 Opciones para mostrar/ocultar acciones
  @Input() showEdit: boolean = false;
  @Input() showDisable: boolean = false;
  @Input() showDelete: boolean = false;

  // 🆕 Eventos para emitir cuando se hace clic en Editar, Deshabilitar o Eliminar
  @Output() rowSelected = new EventEmitter<TData>();
  @Output() isOnNew = new EventEmitter<void>();
  @Output() editRow = new EventEmitter<TData>();
  @Output() disableRow = new EventEmitter<TData>();
  @Output() deleteRow = new EventEmitter<TData>();

  sorting = signal<SortingState>([]);
  pagination = signal({ pageSize: 5, pageIndex: 0 });

  table = computed(() => {
    return createAngularTable(() => ({
      data: this.data,
      columns: this.columns as ColumnDef<unknown, any>[],
      state: {
        sorting: this.sorting(),
        pagination: this.pagination(),
      },
      onSortingChange: updater =>
        this.sorting.set(updater instanceof Function ? updater(this.sorting()) : updater),
      onPaginationChange: updater =>
        this.pagination.set(updater instanceof Function ? updater(this.pagination()) : updater),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      enableRowSelection: true,
      getFilteredRowModel: getFilteredRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
    }));
  });

  hasFilteredData = computed(() => this.table().getRowModel().rows.length > 0);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columns']) {
      this.sorting.set([]);
    }
  }

  selectRow(index: number) {
    this.rowSelected.emit(this.data[index]);
  }

  emitNewEvent() {
    this.isOnNew.emit();
  }

  emitEdit(row: any) {
    this.editRow.emit(row.original as TData);
  }

  emitDisable(row: any) {
    this.disableRow.emit(row.original as TData);
  }

  emitDelete(row: any) {
    this.deleteRow.emit(row.original as TData);
  }

  isRowActive(row: any): boolean {
    return row.original && 'is_active' in row.original && row.original.is_active;
  }
}
