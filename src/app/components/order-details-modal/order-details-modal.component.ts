import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-order-details-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './order-details-modal.component.html',
  standalone: true,
  styleUrl: './order-details-modal.component.scss'
})
export class OrderDetailsModalComponent implements OnInit {
  public formOrder!: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.formOrder = this._fb.group({
      name: [null as File | null, [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      vin: ['', [Validators.required]],
      details: ['', [Validators.required]],
    });
  }
}
