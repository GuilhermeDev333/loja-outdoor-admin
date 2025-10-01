import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Order } from './order.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly storageKey = 'orders';

  private orders: Order[] = [
    {
      id: 1,
      customerName: 'João Silva',
      customerCpf: '111.222.333-44',
      customerPhone: '(11) 98765-4321',
      customerEmail: 'joao.silva@example.com',
      serviceName: 'Outdoor',
      totalPrice: 350.0,
      status: 'Pendente',
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
      status: 'Em Processo',
      orderDate: new Date('2023-10-25T14:30:00'),
    },
  ];

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;
    const storedOrders = localStorage.getItem(this.storageKey); // Agora seguro
    if (storedOrders) {
      this.orders = JSON.parse(storedOrders).map((order: Order) => ({
        ...order,
        orderDate: new Date(order.orderDate), // Converte a string de volta para Date
      }));
    } else {
      // Se não houver nada no localStorage, salva os dados iniciais.
      this._saveToLocalStorage();
    }
  }

  getOrders(): Order[] {
    return [...this.orders]; // Retorna uma cópia para evitar modificações diretas
  }

  addOrder(newOrder: Partial<Order>): void {
    const id = this.orders.length > 0 ? Math.max(...this.orders.map((o) => o.id)) + 1 : 1;
    const orderToAdd: Order = { ...newOrder, id, orderDate: new Date() } as Order;
    this.orders.push(orderToAdd);
    this._saveToLocalStorage();
  }

  updateOrder(updatedOrder: Order): void {
    const index = this.orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = {
        ...updatedOrder,
        orderDate: new Date(updatedOrder.orderDate) // Garante que a data seja um objeto Date
      };
      this._saveToLocalStorage();
    }
  }

  deleteOrder(id: number): void {
    this.orders = this.orders.filter((order) => order.id !== id);
    this._saveToLocalStorage();
  }

  private _saveToLocalStorage(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.orders)); // Agora seguro
  }
}