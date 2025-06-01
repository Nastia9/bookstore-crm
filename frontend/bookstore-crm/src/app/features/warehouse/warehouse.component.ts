import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

import { MatTableModule }        from '@angular/material/table';
import { MatFormFieldModule }    from '@angular/material/form-field';
import { MatInputModule }        from '@angular/material/input';
import { MatSelectModule }       from '@angular/material/select';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { MatCardModule }         from '@angular/material/card';
import { MatPaginatorModule }    from '@angular/material/paginator';
import { MatSortModule }         from '@angular/material/sort';
import { MatDialog, MatDialogModule }       from '@angular/material/dialog';
import { MatTooltipModule }      from '@angular/material/tooltip';

import { startWith, debounceTime } from 'rxjs/operators';
import { BooksService } from '../../core/services/rest/books.service';
import { Book } from '../../core/models/book';
import { Category } from '../../core/models/category';
import { AddEditBookDialogComponent } from './components/add-edit-book-dialog/add-edit-book-dialog.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // Material
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  private booksService = inject(BooksService);
  private dialog       = inject(MatDialog);

  private allBooks$ = this.booksService.getBooks();

  public rawBooks     = signal<Book[]>([]);
  public filteredBooks = signal<Book[]>([]);

  public searchText       = '';
  public selectedCategory = 'Усі категорії'; 
  public categories       = signal<string[]>([]);

  public totalTitles   = computed(() => this.filteredBooks().length);
  public totalQuantity = computed(() => 
    this.filteredBooks().reduce((sum, b) => sum + b.stock, 0)
  );
  public totalValue    = computed(() =>
    this.filteredBooks().reduce((sum, b) => sum + b.price * b.stock, 0)
  );

  public displayedColumns: string[] = [
    'id', 'title', 'author', 'isbn', 'categories', 'price', 'quantity', 'status', 'actions'
  ];

  ngOnInit(): void {
    this.allBooks$.pipe(
      startWith<Book[]>([]),
      debounceTime(200)
    ).subscribe(books => {
      this.rawBooks.set(books);

      const allCatNames = books
        .flatMap(b => b.categories.map(c => c.name));
      const uniqNames = Array.from(new Set(allCatNames));
      this.categories.set(['Усі категорії', ...uniqNames]);

      this.applyFilter(books);
    });
  }

  public onFilterChange(): void {
    const books = this.rawBooks();
    this.applyFilter(books);
  }

  private applyFilter(books: Book[]): void {
    let filtered = books;

    const txt = this.searchText.trim().toLowerCase();
    if (txt.length > 0) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(txt) ||
        (b.author.lastName + b.author.firstName).toLowerCase().includes(txt)
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 'Усі категорії') {
      filtered = filtered.filter(b =>
        b.categories.some(c => c.name === this.selectedCategory)
      );
    }

    this.filteredBooks.set(filtered);
  }

  public getStatus(book: Book): 'Достатньо' | 'Середньо' | 'Низько' {
    if (book.stock >= 15)    return 'Достатньо';
    else if (book.stock >= 8) return 'Середньо';
    else                         return 'Низько';
  }

    openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEditBookDialogComponent, {
      data: { bookToEdit: null } as any
    });

    dialogRef.afterClosed().subscribe((created: Book | null) => {
      if (created) {
        const current = this.filteredBooks();
        this.filteredBooks.set([created, ...current]);
      }
    });
  }

  openEditDialog(book: Book): void {
    const dialogRef = this.dialog.open(AddEditBookDialogComponent, {
      data: { bookToEdit: book }
    });

    dialogRef.afterClosed().subscribe((updated: Book | null) => {
      if (!updated) {
        return;
      }

      const allBooks = [...this.rawBooks()];
      const rawIdx = allBooks.findIndex(b => b.id === updated.id);
      if (rawIdx > -1) {
        allBooks[rawIdx] = updated;
        this.rawBooks.set(allBooks);
      }

      this.applyFilter(this.rawBooks());
  });
}

  deleteBook(bookId: string): void {
    this.booksService.deleteBook(bookId).subscribe({
      next: () => {
        const current = this.filteredBooks().filter(b => b.id !== bookId);
        this.filteredBooks.set(current);
      },
      error: (err) => {
        console.error('Не вдалось видалити книгу:', err);
      }
    });
  }

  public formatPrice(price: number): string {
    return price.toLocaleString('uk-UA') + ' ₴';
  }

  public formatCategories(categories: Category[]): string {
      return categories.map(c => c.name).join(', ');
  }
}