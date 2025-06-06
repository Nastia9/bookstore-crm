import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../models/category';
import { Author } from '../../models/author';
import { AddEditBookRequestParameter } from '../../models/request/add-edit-book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private http = inject(HttpClient);

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/books/`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/categories`, { name });
  }

  createBook(payload: Partial<AddEditBookRequestParameter>): Observable<Book> {
    return this.http.post<Book>(`${environment.apiUrl}/books/`, payload);
  }

  updateBook(bookId: string, payload: Partial<AddEditBookRequestParameter>): Observable<Book> {
    return this.http.put<Book>(`${environment.apiUrl}/books/${bookId}`, payload);
  }

  deleteBook(bookId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/books/${bookId}`);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${environment.apiUrl}/authors/`);
  }

  createAuthor(dto: { firstName: string; lastName: string; bio?: string }): Observable<Author> {
    return this.http.post<Author>(`${environment.apiUrl}/authors/`, dto);
  }
}
