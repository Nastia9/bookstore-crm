import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Order } from '../../core/models/order';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { OrderStatus } from '../../core/models/enums/order-status';
import { OrdersService } from '../../core/services/rest/orders.service';
import { FilterOrderStatus } from '../../core/models/enums/filter-order-status';
import { OrderDetailsDialogComponent, OrderDetailsDialogData } from './order-details-dialog/order-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public FilterOrderStatus = FilterOrderStatus;
  private ordersService = inject(OrdersService);
  private dialog = inject(MatDialog);

  private allOrders$ = this.ordersService.getOrders();

  public searchText = '';
  public selectedStatus: FilterOrderStatus = FilterOrderStatus.all;
  public dateFrom: Date | null = null;
  public dateTo: Date | null = null;

  public filteredOrders = signal<Order[]>([]);

  public totalOrders = signal<number>(0);
  public processingCount = signal<number>(0);
  public totalSum = signal<number>(0);

  public displayedColumns: string[] = [
    'id',
    'clientName',
    'date',
    'status',
    'itemsCount',
    'totalSum'
  ];

  ngOnInit(): void {
    this.allOrders$.pipe(
      startWith<Order[]>([]),
      debounceTime(100)
    )
    .subscribe(orders => {
      this.applyFilter(orders);
    });
  }

  public onFilterChange(): void {
    this.allOrders$.pipe(
      startWith<Order[]>([]),
      map(orders => orders)
    )
    .subscribe(orders => {
      this.applyFilter(orders);
    });
  }

  private applyFilter(orders: Order[]) {
    let filtered = orders;

    const txt = this.searchText.trim().toLowerCase();
    if (txt.length > 0) {
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(txt) ||
        (o.user.lastName + o.user.lastName).toLowerCase().includes(txt)
      );
    }

    if (this.selectedStatus !== FilterOrderStatus.all) {
      filtered = filtered.filter(o => (o.status as number) === (this.selectedStatus as number));
    }

    if (this.dateFrom) {
      filtered = filtered.filter(o => o.createdAt >= this.dateFrom!);
    }
    if (this.dateTo) {
      filtered = filtered.filter(o => o.createdAt <= this.dateTo!);
    }

    this.totalOrders.set(filtered.length);
    this.processingCount.set(filtered.filter(o => o.status === OrderStatus.pending).length);
    this.totalSum.set(filtered.reduce((sum, o) => sum + o.items.reduce((sum, o) => sum + o.unitPrice, 0), 0));

    this.filteredOrders.set(filtered);
  }

  public resetFilters(): void {
    this.searchText = '';
    this.selectedStatus = FilterOrderStatus.all;
    this.dateFrom = null;
    this.dateTo = null;
    this.onFilterChange();
  }

  public openDetails(orderId: string): void {
    const dialogRef = this.dialog.open<OrderDetailsDialogComponent, OrderDetailsDialogData>(
      OrderDetailsDialogComponent,
      {
        data: { orderId },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.updated) {
        this.allOrders$.pipe(
          startWith<Order[]>([]),
          debounceTime(100)
        )
        .subscribe(orders => {
          this.applyFilter(orders);
        });
        this.allOrders$.subscribe(orders => this.applyFilter(orders));
      }
    });
  }
}
