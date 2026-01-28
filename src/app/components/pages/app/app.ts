import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CHeader } from '../../ui/c-header/c-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly router = inject(Router)

  async ngOnInit() {
  }
  
}
