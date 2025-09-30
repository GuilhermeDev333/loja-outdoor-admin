import { Injectable } from '@angular/core';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      customerName: 'João Silva',
      customerCpf: '111.222.333-44',
      customerPhone: '(11) 98765-4321',
      customerEmail: 'joao.silva@example.com',
      serviceName: 'Outdoor',
      totalPrice: 350.0,
      status: 'Pending',
      orderDate: new Date('2023-10-26T10:00:00'),
    },
    {
      id: 2,
      customerName: 'Maria Souza',
      customerCpf: '555.666.777-88',
      customerPhone: '(21) 91234-5678',
      customerEmail: 'maria.souza@example.com',
      serviceName: 'Banner',
      totalPrice: 500.0,
      status: 'Processing',
      orderDate: new Date('2023-10-25T14:30:00'),
    },
  ];

  constructor() {}

  getOrders(): Order[] {
    return [...this.orders]; // Retorna uma cópia para evitar modificações diretas
  }

  addOrder(newOrder: Omit<Order, 'id' | 'orderDate' | 'totalPrice' | 'status' | 'quantity'>): void {
    const id = this.orders.length > 0 ? Math.max(...this.orders.map((o) => o.id)) + 1 : 1;
    // Simulação de preço e status inicial
    const totalPrice = 250; // Preço base fixo para simulação
    const orderToAdd: Order = { ...newOrder, id, totalPrice, status: 'Pending', orderDate: new Date() };
    this.orders.push(orderToAdd);
  }

  updateOrder(updatedOrder: Order): void {
    const index = this.orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
  }

  deleteOrder(id: number): void {
    this.orders = this.orders.filter((order) => order.id !== id);
  }
}