import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule  } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart-checkout-modal',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, ReactiveFormsModule, NgbModalModule],
  providers: [NgbActiveModal],
  templateUrl: './cart-checkout-modal.component.html',
  styleUrl: './cart-checkout-modal.component.scss'
})
export class CartCheckoutModalComponent {
  @Input() totalItems = 0;
  @Input() totalQuantity = 0;
  @Input() totalPrice = 0;

  addressForm!: FormGroup;

  constructor(private fb: FormBuilder, private cart: CartService, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.addressForm = this.fb.group({
      region: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      apartmentNumber: [''],
    });
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
