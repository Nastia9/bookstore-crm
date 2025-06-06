import { Component, OnInit, signal, computed, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, startWith } from 'rxjs';
import { UsersService } from '../../core/services/rest/users.service';
import { User } from '../../core/models/user';
import { UserRole } from '../../core/models/enums/user-role';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  private allUsers$ = this.usersService.getUsers();

  public rawUsers = signal<User[]>([]);
  public filteredUsers = signal<User[]>([]);

  public searchText = '';

  public displayedColumns: string[] = [
    'name',
    'email',
    'phoneNumber',
    'role',
    'actions'
  ];

  ngOnInit(): void {
    this.allUsers$
      .pipe(
        startWith<User[]>([]),
        debounceTime(200)
      )
      .subscribe(users => {
        this.rawUsers.set(users);

        const uniqRoles: (UserRole | 'all')[] = Array.from(
          new Set(users.map(u => u.role))
        );

        this.applyFilter(users);
      });
  }

  public onFilterChange(): void {
    const all = this.rawUsers();
    this.applyFilter(all);
  }

  private applyFilter(users: User[]): void {
    let filtered = users;

    const txt = this.searchText.trim().toLowerCase();
    if (txt.length > 0) {
      filtered = filtered.filter(u =>
        u.lastName.toLowerCase().includes(txt) ||
        u.firstName.toLowerCase().includes(txt) ||
        u.email.toLowerCase().includes(txt)
      );
    }

    this.filteredUsers.set(filtered);
  }

  public openAddUserDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: { userToEdit: null } as any
    });

    dialogRef.afterClosed().subscribe((created: User | null) => {
      if (created) {
        this.rawUsers.update(oldUsers => [created, ...oldUsers]);
        this.onFilterChange();
      }
    });
  }

  public openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: { userToEdit: user }
    });

    dialogRef.afterClosed().subscribe((updated: User | null) => {
      if (updated) {
        this.rawUsers.update(oldUsers => {
          return oldUsers.map(u => (u.id === updated.id ? updated : u));
        });
        this.onFilterChange();
      }
    });
  }

  public deleteUser(userId: string): void {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        this.rawUsers.update(oldUsers =>
          oldUsers.filter(u => u.id !== userId)
        );
        this.onFilterChange();
      },
      error: (err) => {
        console.error('Не вдалось видалити користувача:', err);
      }
    });
  } 
}
