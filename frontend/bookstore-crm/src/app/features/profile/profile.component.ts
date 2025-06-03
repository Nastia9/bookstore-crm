import { Component, OnInit, inject, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { MatBadgeModule } from '@angular/material/badge'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'

import { signal } from '@angular/core'
import { Observable, of, switchMap, tap } from 'rxjs'
import { AuthService } from '../../core/services/general/auth.service'
import { OrdersService } from '../../core/services/rest/orders.service'
import { Order } from '../../core/models/order'
import { OrderStatus } from '../../core/models/enums/order-status'


@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatBadgeModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService)
  private ordersService = inject(OrdersService)

  public currentUser = this.authService.currentUser

  public isLoading = signal<boolean>(false)

  public myOrders = signal<Order[]>([])

  public totalOrders = computed(() => this.myOrders().length)
  public pendingCount = computed(() =>
    this.myOrders().filter(o => o.status === OrderStatus.pending).length
  )

  public displayedColumns = [
    'date',
    'status',
    'itemsCount',
    'totalSum'
  ]

  ngOnInit(): void {
    this.fetchMyOrders()
  }

  private fetchMyOrders() {
    this.isLoading.set(true)

    this.ordersService.getMyOrders().subscribe({
      next: (orders) => {
        this.myOrders.set(orders)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Не вдалося завантажити замовлення:', err)
        this.myOrders.set([])
        this.isLoading.set(false)
      }
    })
  }

  public formatPrice(price: number): string {
    return price.toLocaleString('uk-UA') + ' ₴'
  }

  public getStatusLabel(status: OrderStatus): { text: string; color: 'primary' | 'accent' | 'warn' } {
    switch (status) {
      case OrderStatus.pending: return { text: 'В обробці', color: 'primary' }
      case OrderStatus.shipped: return { text: 'Виконано', color: 'accent' }
      case OrderStatus.cancelled: return { text: 'Скасовано', color: 'warn' }
      default: return { text: 'Невідомо', color: 'warn' }
    }
  }

  public formatOrderTotalPrice(order: Order): string {
    let price = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    return this.formatPrice(price);
  }
}
