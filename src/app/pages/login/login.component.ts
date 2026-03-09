import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public formLogIn!: FormGroup;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.formLogIn = this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      popBot: [null],
    });
  }

  public logIn(): void {
    if (this.formLogIn.invalid) {
      this.formLogIn.markAllAsTouched();
      return;
    }

    this.authService.login({
      email: this.formLogIn.controls['email'].value,
      password: this.formLogIn.controls['password'].value,
    });
  }
}
