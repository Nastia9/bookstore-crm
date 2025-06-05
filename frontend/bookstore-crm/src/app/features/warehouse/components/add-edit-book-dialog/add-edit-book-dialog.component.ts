import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { switchMap, tap, of } from 'rxjs';
import { BooksService } from '../../../../core/services/rest/books.service';
import { Book } from '../../../../core/models/book';
import { Category } from '../../../../core/models/category';
import { Author } from '../../../../core/models/author';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { AddAuthorDialogComponent } from '../add-author-dialog/add-author-dialog.component';
import { ImagesService } from '../../../../core/services/rest/images.service';
import { environment } from '../../../../../environments/environment';

interface AddEditBookData {
  bookToEdit: Book | null;
}

@Component({
  selector: 'app-add-edit-book-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './add-edit-book-dialog.component.html',
  styleUrl: './add-edit-book-dialog.component.scss'
})
export class AddEditBookDialogComponent implements OnInit {
  private booksService = inject(BooksService);
  private imagesService = inject(ImagesService);
  private dialog = inject(MatDialog);
  private dialogRef = inject<MatDialogRef<AddEditBookDialogComponent, Book | null>>(MatDialogRef);
  private data = inject<AddEditBookData>(MAT_DIALOG_DATA);

  public bookForm!: FormGroup;
  public categories: Category[] = [];
  public authors: Author[] = [];
  public mode: 'add' | 'edit' = 'add';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mode = (this.data && this.data.bookToEdit) ? 'edit' : 'add';

    this.bookForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      authorId: ['', Validators.required],
      isbn: ['', Validators.required],
      categoryIds: [[]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagePath: ['']
    });

    if (this.mode === 'edit' && this.data.bookToEdit) {
      const b = this.data.bookToEdit;
      this.bookForm.patchValue({
        id: b.id,
        title: b.title,
        authorId: b.author.id,
        isbn: b.isbn,
        categoryIds: [...b.categories.map(c => c.id)],
        price: b.price,
        stock: b.stock,
        imagePath: b.imagePath ?? ''
      });
    }

    this.loadCategories();
    this.loadAuthors();
  }

  private loadCategories(): void {
    this.booksService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => {
        console.error('Помилка під час завантаження категорій', err);
        this.categories = [];
      }
    });
  }

  private loadAuthors(): void {
    this.booksService.getAuthors().subscribe({
      next: auths => this.authors = auths,
      error: err => {
        console.error('Помилка під час завантаження авторів', err);
        this.authors = [];
      }
    });
  }

  onCategoryChange(value: string[] | string): void {
    if (Array.isArray(value) && value.includes('__new_category__')) {
      const catDialogRef = this.dialog.open(AddCategoryDialogComponent);
      catDialogRef.afterClosed().pipe(
        switchMap((newName: string | undefined) => {
          if (newName && newName.trim()) {
            return this.booksService.createCategory(newName.trim());
          }
          return of<Category | null>(null);
        }),
        tap((created: Category | null) => {
          if (created) {
            this.categories = [...this.categories, created];
            const selected: (string | undefined)[] = this.bookForm.value.categoryIds.map((cid: string) =>
              cid === '__new_category__' ? created.id : cid
            );
            this.bookForm.patchValue({ categoryIds: selected });
          } else {
            const filtered = this.bookForm.value.categoryIds.filter((cid: string) => cid !== '__new_category__');
            this.bookForm.patchValue({ categoryIds: filtered });
          }
        })
      ).subscribe();
    }
  }

  onAuthorChange(value: string): void {
    if (value === '__new_author__') {
      const authDialogRef = this.dialog.open(AddAuthorDialogComponent);
      authDialogRef.afterClosed().pipe(
        switchMap((newDto: { firstName: string; lastName: string; bio?: string } | undefined) => {
          if (newDto && newDto.firstName && newDto.lastName) {
            return this.booksService.createAuthor({
              firstName: newDto.firstName.trim(),
              lastName: newDto.lastName.trim(),
              bio: newDto.bio?.trim()
            });
          }
          return of<Author | null>(null);
        }),
        tap((created: Author | null) => {
          if (created) {
            this.authors = [...this.authors, created];
            this.bookForm.patchValue({ authorId: created.id });
          } else {
            this.bookForm.patchValue({ authorId: '' });
          }
        })
      ).subscribe();
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }
    const val = this.bookForm.value as Partial<Book>;

    if (this.mode === 'add') {
      this.booksService.createBook(val).subscribe({
        next: (created: Book) => {
          this.dialogRef.close(created);
        },
        error: err => {
          console.error('Помилка створення книги:', err);
          this.dialogRef.close(null);
        }
      });
    } else {
      const bookId = val.id!;
      this.booksService.updateBook(bookId, val).subscribe({
        next: (updated: Book) => {
          this.dialogRef.close(updated);
        },
        error: err => {
          console.error('Помилка оновлення книги:', err);
          this.dialogRef.close(null);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('files', file);

    this.imagesService.uploadImage(formData).subscribe({
      next: (res) => {
        this.bookForm.patchValue({ imagePath: res.imagePath });
      },
      error: (err) => {
        console.error('Помилка завантаження зображення', err);
      }
    });
  }
}
