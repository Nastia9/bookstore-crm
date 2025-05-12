import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { NgbModalModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartCheckoutModalComponent } from '../cart-checkout-modal/cart-checkout-modal.component';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  standalone: true,
  providers: [NgbActiveModal],
  imports: [CommonModule, FormsModule, LucideAngularModule, NgbModalModule]
})
export class CartModalComponent {
  constructor(private cart: CartService, private modal: NgbModal,  public activeModal: NgbActiveModal) {}

  get items$(): Observable<CartItem[]> {
    return this.cart.items$;
  }

  get total$(): Observable<number> {
    return this.cart.items$.pipe(
      map(items => items.reduce((sum, i) => sum + i.book.price * i.quantity, 0))
    );
  }

  remove(item: CartItem) {
    this.cart.remove(item.book);
  }

  dec(item: CartItem) {
    this.cart.changeQuantity(item.book, -1);
  }

  inc(item: CartItem) {
    this.cart.changeQuantity(item.book, +1);
  }

  get total() {
    return this.cart.items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
  }

  onCheckout() {
    this.activeModal.close();

    setTimeout(() => {
      this.modal.open(CartCheckoutModalComponent, {
        centered: true,
        size: 'lg',
      });
    }, 0);
  }

  onClose() {
    this.activeModal.close();
  }
}
