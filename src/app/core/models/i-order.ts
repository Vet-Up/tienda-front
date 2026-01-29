import { IUser } from './i-user';
import { IProduct } from './i-cart_item';

export interface IOrderItem {
  id: number;
  quantity: number;
  product: IProduct;
}

export interface IOrder {
  id: number;
  totalProducts: number;
  totalPrice: number;
  state: string;
  user: IUser;
  createdAt: string;
  orderAt?: string | null;
  address?: string | null;
  orderItems: IOrderItem[];
}
