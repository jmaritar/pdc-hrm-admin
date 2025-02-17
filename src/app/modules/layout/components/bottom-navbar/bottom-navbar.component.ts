import { Component, OnInit } from '@angular/core';

import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css'],
  imports: [AngularSvgIconModule],
})
export class BottomNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('BottomNavbarComponent initialized');
  }
}
