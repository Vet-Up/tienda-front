import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-c-header',
  imports: [RouterLink],
  templateUrl: './c-header.html',
  styleUrl: './c-header.scss',
})
export class CHeader {
  showDropdown = false;
  username = '';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private element: ElementRef,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.isLoggedIn = true;
      } else {
        this.username = '';
        this.isLoggedIn = false;
      }
    });
  }

  navigateToWelcome() {
    this.router.navigate(['/main']);
  }

  toggleDropdown(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showDropdown) return;
    const target = event.target as HTMLElement;
    if (this.element && !this.element.nativeElement.contains(target)) {
      this.showDropdown = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/main']);
  }
}
