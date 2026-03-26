import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICart } from '../../core/models/cart.model';
import { environment } from '../../../environment/environment';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit{
  cart: ICart | null = null;
  errorMsg: string='';
  staticURL = environment.staticFilesURL;

  constructor(private _cartService : CartService,
              private _cdr: ChangeDetectorRef
              ){}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart():void{
    this._cartService.getCart().subscribe({
      next:(res)=> {
                    this.cart = res.data;
                    this._cdr.detectChanges();
                  },
      error:(err)=> this.errorMsg = err.error.message
    });
  }

  updateQuantity(productId:string, quantity:number):void{
    if(quantity < 1) return;
    this._cartService.updateItem(productId, quantity).subscribe({
      next:() => {
                  // this.cart = res.data;
                  // this._cdr.detectChanges();
                  this.loadCart();
      }
    });
  }

  removeItem(productId:string):void{
    this._cartService.removeItem(productId).subscribe({
      next:() => {
        this.loadCart();
        // this.cart = res.data;
        // this._cdr.detectChanges();
      }
    });
  }

  clearCart():void{
    this._cartService.clearCart().subscribe({
      next:() =>{
        this.cart = null;
        this._cdr.detectChanges();
      }
    });
  }
}
