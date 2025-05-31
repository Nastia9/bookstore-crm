import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../home/components/book-card/book-card.component';
import { FormsModule } from '@angular/forms';
import { Book } from '../../core/models/book'
import { inject } from '@angular/core';
import { BooksService } from '../../core/services/rest/books.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  searchTerm = '';
  books: Book[] = [];

  private booksService = inject(BooksService);

  constructor() {
    this.loadBooks();
  }

  loadBooks() {
      this.booksService.getBooks().subscribe(result =>{ 
        this.books = result
      })
  }

  get filteredBooks() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.books;
    return this.books.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.author.firstName.toLowerCase().includes(term)
    );
  }
}


