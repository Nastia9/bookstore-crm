import { Component, Inject, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../../core/services/rest/users.service';
import { User } from '../../../../core/models/user';
import { UserRole } from '../../../../core/models/enums/user-role';
import { AddEditUserRequestParameter } from '../../../../core/models/request/add-edit-user';

interface EditUserDialogData {
  userToEdit: User | null;
}

@Component({
  selector: 'app-edit-user-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent {
  private dialogRef = inject<MatDialogRef<EditUserDialogComponent>>(MatDialogRef);
  private usersService = inject(UsersService);
  private data = inject<EditUserDialogData>(MAT_DIALOG_DATA);

  public firstName = signal(this.data.userToEdit ? this.data.userToEdit.firstName : '');
  public lastName = signal(this.data.userToEdit ? this.data.userToEdit.lastName : '');
  public email = signal(this.data.userToEdit ? this.data.userToEdit.email : '');
  public role = signal<UserRole>(this.data.userToEdit ? this.data.userToEdit.role : UserRole.customer);

  public isSaving = signal(false);
  public errorMsg = signal<string | null>(null);

  public title = this.data.userToEdit ? 'Редагувати користувача' : 'Створити користувача';
  public actionLabel = this.data.userToEdit ? 'Оновити користувача' : 'Додати користувача';

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    this.errorMsg.set(null);
    this.isSaving.set(true);

    const dto: AddEditUserRequestParameter = {
      id: this.data.userToEdit?.id,
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      role: this.role(),
      password: "P@ssw0rd!"
    };

    if (this.data.userToEdit) {
      this.usersService.updateUser(this.data.userToEdit.id, dto).subscribe({
        next: updated => {
          this.isSaving.set(false);
          this.dialogRef.close(updated);
        },
        error: err => {
          this.isSaving.set(false);
          this.errorMsg.set('Не вдалося оновити користувача.');
          console.error(err);
        },
      });
    } else {
      this.usersService.createUser(dto).subscribe({
        next: created => {
          this.isSaving.set(false);
          this.dialogRef.close(created);
        },
        error: err => {
          this.isSaving.set(false);
          this.errorMsg.set('Не вдалося створити користувача.');
          console.error(err);
        },
      });
    }
  }
}
