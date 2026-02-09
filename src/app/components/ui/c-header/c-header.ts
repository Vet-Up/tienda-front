import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { Component, ElementRef, HostListener } from '@angular/core';

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
  cartItemCount = 0;
  private cartSubscription: any;

  constructor(private router: Router, private authService: AuthService, private cartService: CartService, private element: ElementRef) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.isLoggedIn = true;
      } else {
        this.username = '';
        this.isLoggedIn = false;
        this.cartItemCount = 0;
      }
    });
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      if (cart && cart.cartItems) {
        this.cartItemCount = cart.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      } else {
        this.cartItemCount = 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
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

  openSidebar(): void {
    this.cartService.openSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.showDropdown = false;
    this.router.navigate(['/main']);
  }
}
