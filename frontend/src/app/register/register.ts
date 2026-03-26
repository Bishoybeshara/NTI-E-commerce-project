import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { IRegisterData } from '../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , RouterLink ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  errorMsg:string= '';

  registerForm = new FormGroup({
    name: new FormControl('' , [Validators.required , Validators.minLength(3)]),
    email: new FormControl('' , [
      Validators.required,
      Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ]),
    phone: new FormControl('' , [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]),
    password: new FormControl('',[
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=#~^])[A-Za-z\d@$!%*?&=#~^]{8,}$/)
    ]),
    gender: new FormControl('' ,[Validators.required]),
    address:new FormControl('')
  });

  constructor(private _authService:AuthService){}

  onSubmit(){
    if(this.registerForm.invalid) return

    const data : IRegisterData = {
      name : this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      phone: this.registerForm.value.phone!,
      password: this.registerForm.value.password!,
      gender: this.registerForm.value.gender as 'male' | 'female',
      address: this.registerForm.value.address || undefined
    };

    this._authService.register(data).subscribe({
      error: (err)=> this.errorMsg = err.error.message
    });
  }
}
