import { Component, computed, Input, WritableSignal } from '@angular/core';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-data-table-toolbar',
  standalone: true,
  imports: [HlmButtonDirective],
  templateUrl: './data-table-toolbar.component.html',
})
export class DataTableToolbarComponent {
  @Input() count!: WritableSignal<number>;
  @Input() showCounter!: WritableSignal<boolean>;

  conditionalCount = computed(() => {
    if (this.showCounter()) {
      return `The count is ${this.count()}.`;
    } else {
      return 'Nothing to see here!';
    }
  });
}
