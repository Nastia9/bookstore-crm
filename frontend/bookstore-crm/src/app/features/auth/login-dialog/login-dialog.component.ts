import { Component, inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/general/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-login-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);

  public loginForm: FormGroup;
  public serverError: string | null = null;
  public isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailControl() {
    return this.loginForm.get('email')!;
  }
  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.serverError = null;
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.serverError = 'Невірний email або пароль';
        } else {
          this.serverError = 'Сталася помилка. Спробуйте пізніше.';
        }
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.dialogRef.close({ email, password });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  openRegister(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialog.open(RegisterDialogComponent).afterClosed().subscribe(success => {
        if (success) {
          alert('Реєстрація успішна! Увійдіть у систему.');
          this.dialog.open(LoginDialogComponent);
        }
      });
    });

    this.dialogRef.close();
  }
}
