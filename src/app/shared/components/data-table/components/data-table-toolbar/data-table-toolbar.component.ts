import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Table } from '@tanstack/angular-table';

@Component({
  selector: 'app-data-table-toolbar',
  standalone: true,
  imports: [FormsModule, HlmButtonDirective],
  templateUrl: './data-table-toolbar.component.html',
})
export class DataTableToolbarComponent<TData> implements OnInit {
  @Input() table!: Table<TData>;
  @Input() filterKey: string = 'firstName';
  @Output() isOnNew = new EventEmitter<void>();

  ngOnInit() {
    console.log('Toolbar initialized with table:', this.table);
  }

  handleNew() {
    this.isOnNew.emit();
  }
}
