import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../core/models/book';
import { CartService } from '../../../../core/services/utils/cart.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input() book!: Book;
  get authorFullName() { return `${this.book.author.firstName} ${this.book.author.lastName}`; }

  get imagePath() { return `https://bookstore-api-e3apf0dna6aff6dv.westeurope-01.azurewebsites.net/${this.book.imagePath}` }

  constructor(private cart: CartService) {}

  addToCart() {
    this.cart.add(this.book);
  }
} 