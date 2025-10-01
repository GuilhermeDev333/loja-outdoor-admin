import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Order } from './order.model';

@Component({
  selector: 'app-add-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './add-order-modal.component.html',
  styleUrl: './add-order-modal.component.css',
})
export class AddOrderModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() orderToEdit: Order | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() orderSubmit = new EventEmitter<Order>();

  isEditMode = false;
  model: Partial<Order> = {};

  services = ['Outdoor', 'Banner', 'Faixa', 'Adesivo', 'Placa'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.isEditMode = !!this.orderToEdit;
      if (this.isEditMode) {
        // Clonar o objeto para não modificar o original diretamente
        this.model = { ...this.orderToEdit };
      } else {
        this.resetForm();
      }
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.orderSubmit.emit(this.model as Order);
    this.onClose();
  }

  private resetForm(): void {
    this.model = {
      customerName: '',
      customerCpf: '',
      customerPhone: '',
      customerEmail: '',
      serviceName: '',
      status: 'Pendente',
      totalPrice: 0,
      height: null,
      width: null,
      length: null,
    };
  }
}