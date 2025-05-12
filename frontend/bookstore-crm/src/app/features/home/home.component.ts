import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../home/components/book-card/book-card.component';
import { FormsModule } from '@angular/forms';
import { Book } from '../../core/models/book'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  searchTerm = '';

  books: Book[] = [
    { id: "1", title: 'Війна і мир', author: 'Лев Толстой', price: 850, inStock: 15 },
    { id: "2", title: 'Злочин і кара', author: 'Федір Достоєвський', price: 750, inStock: 8 },
    { id: "3", title: 'Майстер і Маргарита', author: 'Михайло Булгаков', price: 820, inStock: 12 },
    { id: "4", title: 'Євгеній Онєгін', author: 'Олександр Пушкін', price: 680, inStock: 20 },
  ];

  get filteredBooks() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.books;
    return this.books.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term)
    );
  }
}


