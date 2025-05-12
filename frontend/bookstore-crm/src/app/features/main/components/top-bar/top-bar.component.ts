import { Component, inject } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from '../../../new-order/cart-modal/cart-modal.component';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  imports: [LucideAngularModule, CommonModule, NgbModalModule],
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

  private modal = inject(NgbModal);

  constructor(private cart: CartService) {}

  openCart() {
    this.modal.open(CartModalComponent, {
      centered: true,
      size: 'lg',
    });
  }
}
