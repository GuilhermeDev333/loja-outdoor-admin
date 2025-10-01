import { Component, OnInit } from '@angular/core';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddOrderModalComponent } from "./add-order-modal.component";
import { ConfirmationModalComponent } from "./confirmation-modal.component";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddOrderModalComponent, ConfirmationModalComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  isModalOpen = false;
  currentOrder: Order | null = null;
  isConfirmModalOpen = false;
  orderToDeleteId: number | null = null;
  confirmMessage = '';

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
    this.isModalOpen = false;
    this.currentOrder = null;
    this.loadOrders();
  }

  openDeleteConfirmModal(order: Order): void {
    this.orderToDeleteId = order.id;
    this.confirmMessage = `Tem certeza que deseja excluir o pedido #${order.id} de ${order.customerName}?`;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.orderToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.orderToDeleteId === null) return;
    this.orderService.deleteOrder(this.orderToDeleteId); // Corrigido
    this.loadOrders();
    this.closeConfirmModal();
  }

  generateReceipt(order: Order): void {
    const dimensionsContent = `
      ${order.height ? `<div class="info-item"><strong>Altura:</strong> <span>${order.height} m</span></div>` : ''}
      ${order.width ? `<div class="info-item"><strong>Largura:</strong> <span>${order.width} m</span></div>` : ''}
      ${order.length ? `<div class="info-item"><strong>Comprimento:</strong> <span>${order.length} m</span></div>` : ''}
    `;

    const receiptContent = `
      <div id="receipt-container" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 20px; width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h1 style="text-align: center; color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Comprovante do Pedido #${order.id}</h1>

        <div style="margin-top: 20px;">
          <h2 style="font-size: 1.2em; color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Detalhes do Cliente</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="margin-bottom: 10px;"><strong>Cliente:</strong> <span>${order.customerName}</span></div>
            <div style="margin-bottom: 10px;"><strong>CPF:</strong> <span>${order.customerCpf}</span></div>
            <div style="margin-bottom: 10px;"><strong>Email:</strong> <span>${order.customerEmail || 'N/A'}</span></div>
            <div style="margin-bottom: 10px;"><strong>Telefone:</strong> <span>${order.customerPhone || 'N/A'}</span></div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <h2 style="font-size: 1.2em; color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Detalhes do Pedido</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="margin-bottom: 10px;"><strong>Serviço:</strong> <span>${order.serviceName}</span></div>
            <div style="margin-bottom: 10px;"><strong>Status:</strong> <span>${order.status}</span></div>
            <div style="margin-bottom: 10px;"><strong>Data do Pedido:</strong> <span>${new Date(order.orderDate).toLocaleDateString('pt-BR')}</span></div>
            <div style="margin-bottom: 10px;"><strong>Preço Total:</strong> <span>${order.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
            ${dimensionsContent}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 0.8em; color: #888;">
          Gerado em: ${new Date().toLocaleString('pt-BR')}
        </div>
      </div>
    `;

    // Cria um elemento temporário para renderizar o HTML e gerar o PDF
    const receiptElement = document.createElement('div');
    receiptElement.style.position = 'absolute';
    receiptElement.style.left = '-9999px';
    receiptElement.innerHTML = receiptContent;
    document.body.appendChild(receiptElement);

    const elementToCapture = document.getElementById('receipt-container');

    if (elementToCapture) {
      html2canvas(elementToCapture, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`comprovante-pedido-${order.id}.pdf`);
        document.body.removeChild(receiptElement);
      });
    } else {
      document.body.removeChild(receiptElement);
    }
  }
}