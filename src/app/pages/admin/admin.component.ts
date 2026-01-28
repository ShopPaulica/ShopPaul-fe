import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
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

  constructor(private _fb: FormBuilder) {}

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

  public commands(): void {
    this.selectedTab = 1;
  }

  public addSection(): void {
    this.selectedTab = 2;
  }
}
