import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';

import { ButtonComponent } from '@shared/components/button/button.component';

import { AuthService } from '../data-access/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [FormsModule, ReactiveFormsModule, AngularSvgIconModule, NgIf, ButtonComponent, NgClass],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  private _authService = inject(AuthService);

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    this._authService.signIn(email, password).subscribe({
      next: (response: any) => {
        console.log(response);

        // Suponiendo que el código de estado está en `response.statusCode` y el mensaje en `response.message`
        if (response.statusCode === 200) {
          // Mostrar mensaje de éxito si el código es 200 (éxito)
          toast.success(response.message);

          this._router.navigate(['/home']);
        } else if (response.statusCode === 401) {
          // Mostrar mensaje de error para código 401 (por ejemplo, credenciales inválidas)
          toast.error(response.message);
        } else {
          // Manejar otros códigos de estado
          toast.error('An unexpected error occurred. Please try again.');
        }
      },
      error: error => {
        console.error(error);
        toast.error('Something went wrong. Please try again.', {
          description: error.message,
        });
      },
    });
  }
}
