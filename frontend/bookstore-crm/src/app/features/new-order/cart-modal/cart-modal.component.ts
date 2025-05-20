import { Component, computed, DestroyRef, inject } from '@angular/core';
import { CartService } from '../../../core/services/utils/cart.service';
import { CartItem } from '../../../core/models/cart-item';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  imports: [CommonModule, FormsModule, LucideAngularModule]
})
export class CartModalComponent {
  private readonly cart = inject(CartService);
  private readonly cartModalRef = inject(MatDialogRef<CartModalComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public items = toSignal<CartItem[]>(this.cart.items$);
  public total = computed(() => this.items() ? this.items()!.reduce((sum, i) => sum + i.book.price * i.quantity, 0) : 0);

  remove(item: CartItem) {
    this.cart.remove(item.book);
  }

  dec(item: CartItem) {
    this.cart.changeQuantity(item.book, -1);
  }

  inc(item: CartItem) {
    this.cart.changeQuantity(item.book, +1);
  }

  onCheckout() {
    this.onClose();
  }

  onClose() {
    this.cartModalRef.close();
  }
}
