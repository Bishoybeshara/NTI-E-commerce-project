import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICart } from '../../core/models/cart.model';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';
import { Route, Router } from '@angular/router';
import { ICreateOrder } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cart: ICart | null = null ;
  errorMsg: string = '';

  constructor(
    private _orderService:OrderService,
    private _cartService:CartService,
    private _router: Router,
    private _cdr:ChangeDetectorRef
  ){}

  checkoutForm = new FormGroup({
    phone: new FormControl<string>('',[
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]),
    address: new FormControl<string>('',[Validators.required])
  });

  ngOnInit(): void {
    this._cartService.getCart().subscribe({
      next:(res)=>{
        this.cart = res.data;
        this._cdr.detectChanges();
      },
      error: (err)=> this.errorMsg = err.error.message
    });
  }

  onSubmit():void{
    if(this.checkoutForm.invalid) return;

    const data : ICreateOrder = {
      phone :this.checkoutForm.value.phone!,
      address: this.checkoutForm.value.address!
    };

    this._orderService.createOrder(data).subscribe({
      next: () =>{
        this._cartService.clearCart().subscribe();
        this._router.navigate(['/account']);
      },
      error:(err)=> this.errorMsg = err.error.message
    });
  }
}
