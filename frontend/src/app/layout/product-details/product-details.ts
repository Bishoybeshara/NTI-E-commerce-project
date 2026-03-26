import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IProduct } from '../../core/models/product.model';
import { environment } from '../../../environment/environment';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: IProduct | null = null;
  errorMsg: string= '';
  staticURL = environment.staticFilesURL;
  successMsg:string='';

  constructor (private _productService: ProductService ,
                private _activatedRoute: ActivatedRoute,
                private _cartService : CartService,
                private _cdr : ChangeDetectorRef){}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      const slug = params.get('slug')!;
      this._productService.getProductBySlug(slug).subscribe({
        next: (res) => {
          this.product = res.data;
          this._cdr.detectChanges();
        },
        error: (err)=> this.errorMsg = err.error.message
      })
    });
  }

  cartQuantity: number = 0;

  addToCart():void{
    if(!this.product) return;
    this._cartService.addItem(this.product._id).subscribe({
      next:()=> {
                  this.cartQuantity++;
                  this.product!.stock_quantity--;
                  this.successMsg = `Added to cart! (${this.cartQuantity} in cart)`;
                  this._cdr.detectChanges();
                },
      error: (err) =>this.errorMsg = err.error.message
    });
  }
}


