import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CHeader } from '../../ui/c-header/c-header';
import { CCartSidebar } from '../c-cart-sidebar/c-cart-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CHeader, CCartSidebar],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly router = inject(Router)

  async ngOnInit() {
  }

}
