import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderListComponent } from '../../order-list.component';
import { AddOrderModalComponent } from '../../add-order-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OrderListComponent, AddOrderModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projeto-teste');
}
