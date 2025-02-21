import { Component } from '@angular/core';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-reports',
  imports: [HlmButtonDirective],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {}
