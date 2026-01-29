import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../../core/models/i-order';
import { OrderService } from '../../../core/services/order-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'c-order-page',
  imports: [CommonModule],
  templateUrl: './c-order-page.html',
  styleUrl: './c-order-page.scss',
})
export class COrderPage implements OnInit {
  orders: IOrder[] = [];
  expandedOrderId: number | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user?.id) {
      console.warn('Usuario no autenticado, no se pueden cargar órdenes.');
      return;
    }

    this.orderService.getOrdersByUserId(user.id).subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error al cargar las órdenes', error);
      },
    });
  }

  toggleOrder(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }
}
