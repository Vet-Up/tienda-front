import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICartItem } from '../../../core/models/i-cart_item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { OrderService } from '../../../core/services/order-service';
import { Subscription } from 'rxjs';
import { RouterLink } from "@angular/router";
import { ToastComponent } from '../../ui/toast/toast.component';

@Component({
  selector: 'c-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastComponent],
  templateUrl: './c-cart-page.html',
  styleUrl: './c-cart-page.scss',
})
export class CCartPage implements OnInit {
  private cartSub: Subscription | null = null;
  cartItems: ICartItem[] = [];
  totalPrice: number = 0;
  totalProducts: number = 0;
  errorMessage = '';

  showAddressModal: boolean = false;
  showPaymentModal: boolean = false;
  loadingCheckout: boolean = false;
  checkoutError: string = '';
  checkoutSuccess: string = '';

  address: string = '';
  cardName: string = '';
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCVC: string = '';

  showToast: boolean = false;
  toastMessage: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}


  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe((cart) => {
      if (!cart) return;
      this.cartItems = cart.cartItems || [];
      this.totalPrice = cart.totalPrice || 0;
      this.totalProducts = cart.totalProducts || 0;
    });
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  increment(item: any) {
    if (item._pending) return;
    if (item.quantity >= 20) return;
    item._pending = true;
    this.cartService.updateCartItemById(item.id, { quantity: item.quantity + 1 }).subscribe({
      next: () => {
        item._pending = false;
      },
      error: () => {
        item._pending = false;
      }
    });
  }

  decrement(item: any) {
    if (item._pending) return;
    if (item.quantity <= 1) return;
    item._pending = true;
    this.cartService.updateCartItemById(item.id, { quantity: item.quantity - 1 }).subscribe({
      next: () => {
        item._pending = false;
      },
      error: () => {
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
      },
      error: () => {
        item._pending = false;
      }
    });
  }

  private loadCart(): void {
    const user = this.authService.getUser();

    if (!user || !user.id) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    this.cartService.getCartByUserId(user.id).subscribe({
      next: (cart) => {
        console.log('Carrito cargado:', cart);
        console.log('Items del carrito:', cart.cartItems);
        this.cartItems = cart.cartItems || [];
        this.totalPrice = cart.totalPrice;
        this.totalProducts = cart.totalProducts;
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
        this.errorMessage = 'Error al cargar el carrito';
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

  openPaymentModal() {
    this.showAddressModal = false;
    this.showPaymentModal = true;
    this.cardName = '';
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCVC = '';
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  formatCardName(event: any) {
    this.cardName = event.target.value.toUpperCase();
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formattedValue.substring(0, 19); 
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardExpiry = value.substring(0, 5);
  }

  formatCVC(event: any) {
    this.cardCVC = event.target.value.replace(/\D/g, '').substring(0, 3);
  }

  acceptAddress(event?: Event) {
    if (event) event.preventDefault();
    
    if (!this.address || this.address.trim() === '') {
      this.checkoutError = 'Por favor, ingrese una dirección de envío';
      return;
    }
        this.checkoutError = '';
    this.openPaymentModal();
  }

  processPayment(event?: Event) {
    if (event) event.preventDefault();
    this.loadingCheckout = true;
    this.checkoutError = '';
    this.checkoutSuccess = '';

    const [month, year] = this.cardExpiry.split('/');
    const fullYear = '20' + year;
    const expirationDate = `${fullYear}-${month}-01`;

    const checkoutData = {
      address: this.address,
      cardPaymentRequest: {
        origin: {
          cardNumber: this.cardNumber.replace(/\s/g, ''),
          expirationDate: expirationDate,
          cvc: this.cardCVC,
          fullName: this.cardName
        },
        payment: {
          amount: this.totalPrice,
          concept: `Compra en VetUp Store - Pedido de ${this.cardName}`
        }
      }
    };

    this.orderService.checkout(checkoutData).subscribe({
      next: (order) => {
        this.checkoutSuccess = 'Pedido realizado correctamente.';
        this.loadingCheckout = false;
        this.showPaymentModal = false;
        this.address = '';
        this.cardName = '';
        this.cardNumber = '';
        this.cardExpiry = '';
        this.cardCVC = '';
        this.toastMessage = '¡Pedido realizado con éxito!';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3500);
        console.log('Checkout response:', order);
        this.loadCart();
      },
      error: (err) => {
        this.checkoutError = 'Error al realizar el checkout.';
        this.toastMessage = 'Error al realizar el pedido';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3500);
        console.error(err);
        this.loadingCheckout = false;
      },
    });
  }
}