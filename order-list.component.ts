import { Component, OnInit } from '@angular/core';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddOrderModalComponent } from './add-order-modal.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddOrderModalComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  isModalOpen = false;
  currentOrder: Order | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders = this.orderService.getOrders();
  }

  openAddModal(): void {
    this.currentOrder = null;
    this.isModalOpen = true;
  }

  openEditModal(order: Order): void {
    this.currentOrder = order;
    this.isModalOpen = true;
  }

  handleOrderSubmit(order: Order) {
    if (this.currentOrder) {
      this.orderService.updateOrder(order);
    } else {
      this.orderService.addOrder(order);
    }
    this.orders = this.orderService.getOrders(); // Atualiza a lista diretamente
  }

  deleteOrder(id: number): void {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      this.orderService.deleteOrder(id);
      this.orders = this.orderService.getOrders(); // Atualiza a lista diretamente
    }
  }
}