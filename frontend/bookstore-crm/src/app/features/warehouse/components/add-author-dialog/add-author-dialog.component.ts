import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-author-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './add-author-dialog.component.html',
  styleUrl: './add-author-dialog.component.scss'
})
export class AddAuthorDialogComponent implements OnInit {
  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAuthorDialogComponent, { firstName: string; lastName: string; bio?: string }>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: ['']
    });
  }

  onCreate(): void {
    if (this.form.invalid) return;
    const dto = {
      firstName: this.form.value.firstName.trim(),
      lastName: this.form.value.lastName.trim(),
      bio: this.form.value.bio?.trim()
    };
    this.dialogRef.close(dto);
  }
}
