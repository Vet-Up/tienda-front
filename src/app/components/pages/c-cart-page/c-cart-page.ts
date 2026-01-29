import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICartItem } from '../../../core/models/i-cart_item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { OrderService } from '../../../core/services/order-service';
import { Subscription } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'c-cart-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './c-cart-page.html',
  styleUrl: './c-cart-page.scss',
})
export class CCartPage implements OnInit {
  private cartSub: Subscription | null = null;
  cartItems: ICartItem[] = [];
  totalPrice: number = 0;
  totalProducts: number = 0;
  isLoading = true;
  errorMessage = '';

  showAddressModal: boolean = false;
  loadingCheckout: boolean = false;
  checkoutError: string = '';
  checkoutSuccess: string = '';

  address: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}
  

  ngOnInit(): void {
    // subscribe to shared cart observable so totals update automatically
    this.cartSub = this.cartService.cart$.subscribe((cart) => {
      if (!cart) return;
      this.cartItems = cart.cartItems || [];
      this.totalPrice = cart.totalPrice || 0;
      this.totalProducts = cart.totalProducts || 0;
      this.isLoading = false;
    });
    // initial load
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

    increment(item: any) {
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
        }
      });
    }

    decrement(item: any) {
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
        }
      });
    }

    removeItem(item: any) {
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
        }
      });
    }

  private loadCart(): void {
    const user = this.authService.getUser();
    
    if (!user || !user.id) {
      this.errorMessage = 'Usuario no autenticado';
      this.isLoading = false;
      return;
    }

    this.cartService.getCartByUserId(user.id).subscribe({
      next: (cart) => {
        console.log('Carrito cargado:', cart);
        console.log('Items del carrito:', cart.cartItems);
        this.cartItems = cart.cartItems || [];
        this.totalPrice = cart.totalPrice;
        this.totalProducts = cart.totalProducts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
        this.errorMessage = 'Error al cargar el carrito';
        this.isLoading = false;
      }
    });
  }

  openAddressModal() {
    this.checkoutError = '';
    this.checkoutSuccess = '';
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
  }

  acceptAddress(event?: Event) {
    if (event) event.preventDefault();
    this.loadingCheckout = true;
    this.checkoutError = '';
    this.checkoutSuccess = '';

    this.orderService.checkout({ address: this.address }).subscribe({
      next: (order) => {
        this.checkoutSuccess = 'Pedido realizado correctamente.';
        this.loadingCheckout = false;
        this.showAddressModal = false;
        this.address = '';
        console.log('Checkout response:', order);
        // Refresh cart data on the page
        this.loadCart();
      },
      error: (err) => {
        this.checkoutError = 'Error al realizar el checkout.';
        console.error(err);
        this.loadingCheckout = false;
      },
    });
  }
}

