import { Component, inject, OnInit, Signal, computed } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrdersService } from '../../../core/services/rest/orders.service';
import { Order } from '../../../core/models/order';
import { OrderStatus } from '../../../core/models/enums/order-status';

export interface OrderDetailsDialogData {
  orderId: string;
}

@Component({
  selector: 'app-order-details-dialog',
   imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './order-details-dialog.component.html',
  styleUrl: './order-details-dialog.component.scss'
})
export class OrderDetailsDialogComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private dialogRef = inject(MatDialogRef<OrderDetailsDialogComponent>);
  private data = inject<OrderDetailsDialogData>(MAT_DIALOG_DATA);

  public order: Order | null = null;
  public OrderStatus = OrderStatus;
  public statusForm!: FormGroup;
  public errorMessage: string | null = null;

  public itemsCount = 0;
  public totalSum = 0;
  public orderDate = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ordersService.getOrderById(this.data.orderId)
      .subscribe({
        next: (o) => {
          this.order = o;
          this.itemsCount = o.items.reduce((acc, i) => acc + i.quantity, 0);
          this.totalSum   = o.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
          this.orderDate  = new Date(o.createdAt).toLocaleDateString();
          this.statusForm = this.fb.group({
            status: [o.status]
          });
        },
        error: (err) => {
          this.errorMessage = 'Не вдалося завантажити деталі замовлення.';
        }
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.order) return;
    const newStatus: OrderStatus = this.statusForm.value.status;
    this.ordersService.updateOrderStatus(this.order.id, newStatus)
      .pipe(
        tap(() => {
          this.dialogRef.close({ updated: true, status: newStatus });
        }),
        catchError(err => {
          this.errorMessage = 'Не вдалося оновити статус. Спробуйте пізніше.';
          return of(null);
        })
      )
      .subscribe();
  }
}
