import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'c-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-cart-sidebar.html',
  styleUrls: ['./c-cart-sidebar.scss'],
})
export class CCartSidebar implements OnInit, OnDestroy {
  show: boolean = false;
  cart: any = null;
  get totalItems(): number {
    if (!this.cart || !this.cart.cartItems) return 0;
    return this.cart.cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  }
  subscription: Subscription | null = null;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.cartService.sidebarOpen$.subscribe((open) => {
      console.log('CCartSidebar.subscription -> sidebar open:', open);
      this.show = open;
      if (open) this.loadCart();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this._clickListener) document.removeEventListener('click', this._clickListener);
  }

  loadCart() {
    const user = this.authService.getUser();
    if (!user || !user.id) return;
    this.cartService.getCartByUserId(user.id).subscribe({
      next: (cart) => (this.cart = cart),
      error: () => (this.cart = null),
    });
  }

  close() {
    this.cartService.closeSidebar();
  }

  goToCart() {
    this.close();
    this.router.navigate(['/cart']);
  }

  trackByItemId(index: number, item: any) {
    return item.id;
  }

  testClick(ev: Event) {
    console.log('testClick invoked', ev, ev.target);
  }

  private _clickListener: any = null;
  private _attachDebugClickListener() {
    this._clickListener = (ev: any) => {
      const target = ev.target as HTMLElement;
      if (!target) return;
      const sidebar = document.querySelector('.cart-sidebar');
      if (sidebar && sidebar.contains(target)) {
        console.log('DEBUG: click inside sidebar ->', target.tagName, target.className, target);
      }
    };
    document.addEventListener('click', this._clickListener);
  }


  increment(item: any) {
    console.log('increment called for', item);
    if (item._pending) return;
    const current = item.quantity || 0;
    if (current >= 20) return;
    item._pending = true;
    item.quantity = Math.min(20, current + 1);
    this.cartService.updateCartItemById(item.id, { quantity: item.quantity }).subscribe({
      next: () => {
        item._pending = false;
        this.loadCart();
      },
      error: (err) => {
        console.error('Error updating cart item', err);
        item.quantity = current;
        item._pending = false;
      },
    });
  }

  decrement(item: any) {
    console.log('decrement called for', item);
    if (item._pending) return;
    const current = item.quantity || 1;
    if (current <= 1) return;
    item._pending = true;
    item.quantity = Math.max(1, current - 1);
    this.cartService.updateCartItemById(item.id, { quantity: item.quantity }).subscribe({
      next: () => {
        item._pending = false;
        this.loadCart();
      },
      error: (err) => {
        console.error('Error updating cart item', err);
        item.quantity = current;
        item._pending = false;
      },
    });
  }

  removeItem(item: any) {
    console.log('removeItem called for', item);
    if (item._pending) return;
    item._pending = true;
    this.cartService.deleteCartItemById(item.id).subscribe({
      next: () => {
        item._pending = false;
        this.loadCart();
      },
      error: (err) => {
        console.error('Error deleting cart item', err);
        item._pending = false;
      },
    });
  }
}

