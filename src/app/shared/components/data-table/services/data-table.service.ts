import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly _data = signal<any[]>([]);
  private readonly _columns = signal<any[]>([]);

  setData(data: any[]) {
    this._data.set(data);
  }

  setColumns(columns: any[]) {
    this._columns.set(columns);
  }

  getData() {
    return computed(() => this._data());
  }

  getColumns() {
    return computed(() => this._columns());
  }
}
