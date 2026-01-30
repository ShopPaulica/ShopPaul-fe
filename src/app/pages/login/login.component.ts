import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {LoginRequest, LoginResponse} from '../../shared/interfaces/auth.model';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public formLogIn!: FormGroup;

  constructor(private _fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.formLogIn = this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      popBot: [null],
    })
  }

  public logIn(): void {
    if(this.formLogIn?.valid) {
      this.authService.login(
        {
          email: this.formLogIn.controls['email'].value,
          password: this.formLogIn.controls['password'].value,
        }
      ).subscribe( (res: LoginResponse) => {
        console.log(res)
        }
      )
    }
  }
}
