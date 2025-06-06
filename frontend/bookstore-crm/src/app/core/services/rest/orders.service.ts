import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderRequestParameter } from '../../models/request/order/order';
import { environment } from '../../../../environments/environment';
import { Order } from '../../models/order';
import { OrderStatus } from '../../models/enums/order-status';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);

  createOrder(parameter: OrderRequestParameter): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/orders/`, parameter);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/`);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/my`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/orders/${id}`, { id, status });
  }
}
