import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

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

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.formLogIn = this._fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      popBot: [null],
    })
  }
}
