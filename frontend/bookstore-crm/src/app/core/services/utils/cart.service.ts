import { Injectable } from '@angular/core';
import { Book } from '../../models/book';
import { CartItem } from '../../models/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items.asObservable();

  get items(): CartItem[] {
    return this._items.value;
  }

  add(book: Book) {
    const items = [...this.items];
    const idx = items.findIndex(i => i.book.id === book.id);
    if (idx > -1) {
      items[idx].quantity++;
    } else {
      items.push({ book, quantity: 1 });
    }
    this._items.next(items);
  }

  remove(book: Book) {
    let items = [...this.items];
    const idx = items.findIndex(i => i.book.id === book.id);
    if (idx > -1) {
      items.splice(idx, 1);
      this._items.next(items);
    }
  }

  changeQuantity(book: Book, delta: number) {
    const items = [...this.items];
    const idx = items.findIndex(i => i.book.id === book.id);
    if (idx > -1) {
      items[idx].quantity = Math.max(1, items[idx].quantity + delta);
      this._items.next(items);
    }
  }

  clear() {
    this._items.next([]);
  }
}
