import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',

})
export class NavbarComponent {
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
  @Output() menuStateEmitter = new EventEmitter<string>();
  menuState = 'out';

  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.menuStateEmitter.emit(this.menuState);
  }
}
