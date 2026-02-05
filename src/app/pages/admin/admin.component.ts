import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ordersListComponent} from '../../components/commands-list/orders-list.component';
import {ProductsServices} from '../../shared/services/products.services';
import {NotificationService} from '../../shared/services/notification.service';
import {catchError, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
  ],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.scss'
})
export class AdminComponent  implements OnInit {
  public formProduct!: FormGroup;
  public previewUrl: string | null = null;
  public selectedFileName!: string;
  public selectedTab: number = 2;

  constructor(
    private _fb: FormBuilder,
    private _ps: ProductsServices,
    private readonly _ns: NotificationService

  ) {}

  ngOnInit(): void {
    this.formProduct = this._fb.group({
      image: [null as File | null, [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required]],
    });
  }

  public onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.formProduct.get('image')?.setValue(file);
    this.formProduct.get('image')?.updateValueAndValidity();

    if (!file) {
      this.previewUrl = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.selectedFileName = file.name;
  }

  public orders(): void {
    this.selectedTab = 1;
  }

  public addSection(): void {
    this.selectedTab = 2;
  }

  public saveProduct(): void {
    this._ps.saveProduct({
      title: this.formProduct.controls['title'].value,
      description:  this.formProduct.controls['description'].value,
      image:  this.formProduct.controls['image'].value,
      price:  this.formProduct.controls['price'].value,
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error?.code === 400) {
          this._ns.error(
            'Numele și prețul produsului sunt obligatorii.',
            { title: 'Produs', durationMs: 4000 }
          );
        } else if (err.error?.code === 401) {
          this._ns.error(
            'Trebuie să adaugi o imagine produsului.',
            { title: 'Produs', durationMs: 4000 }
          );
        } else {
          this._ns.error(
            'Nu am putut salva produsul. Eroare de server.',
            { title: 'Produs', durationMs: 4000 }
          );
        }


        return throwError(() => err);
    })).subscribe(() => {
        this._ns.success('Success', { title: 'Create', durationMs: 4000 })
      }
    )
  }
}
