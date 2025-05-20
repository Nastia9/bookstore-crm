import { Component, inject } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from '../../../new-order/cart-modal/cart-modal.component';

import {
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-top-bar',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  title = 'Леобукс';

  get cartItemCount$(): Observable<number> {
    return this.cart.items$.pipe(
      map(items => items.reduce((sum, i) => sum + i.quantity, 0))
    );
  }
  private readonly dialog = inject(MatDialog);

  constructor(private cart: CartService) {}

  openCart() {
    this.dialog.open(CartModalComponent);
  }
}
