import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-responsive-helper',
  templateUrl: './responsive-helper.component.html',
  imports: [NgIf],
})
export class ResponsiveHelperComponent implements OnInit {
  public env: typeof environment = environment;

  constructor() {}

  ngOnInit(): void {
    console.log('ResponsiveHelperComponent initialized');
  }
}
