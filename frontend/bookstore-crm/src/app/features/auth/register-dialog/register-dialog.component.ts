import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../../core/services/general/auth.service";
import { RegisterRequestParameters } from "../../../core/models/request/register";
import { finalize } from "rxjs";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ]
})
export class RegisterDialogComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  public dialogRef = inject(MatDialogRef<RegisterDialogComponent>);
  public isLoading = false;

  public registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    let parameters = new RegisterRequestParameters(
      this.registerForm.value.firstName ?? "", 
      this.registerForm.value.lastName ?? "", 
      this.registerForm.value.email ?? "", 
      this.registerForm.value.password ?? ""
    )
    this.auth.register(parameters).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => alert('Помилка реєстрації. Спробуйте ще раз.')
    });
  }
}
