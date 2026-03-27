import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ILoginData } from '../core/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMsg: string='';


  loginForm = new FormGroup({
    email:new FormControl('',
      [Validators.required ,
      Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl('',
      [Validators.required,
      // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=#~^])[A-Za-z\d@$!%*?&=#~^]{8,}$/)
    ])
  })

  constructor(private _authService:AuthService){}

  onSubmit(){
    if(this.loginForm.invalid) return;

    const data: ILoginData = {
      email : this.loginForm.value.email!,
      password:this.loginForm.value.password!
    };

    this._authService.login(data).subscribe({
      error: (err) => this.errorMsg = err.error.message
    });
  }
}
