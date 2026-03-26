import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { ICartRes } from "../models/cart.model";
import { BehaviorSubject, tap } from "rxjs";

@Injectable({providedIn:'root'})
export class CartService {
  private readonly apiURL = environment.apiURL + 'cart';


  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor(private _http:HttpClient){}

  getCart(){
    return this._http.get<ICartRes>(this.apiURL).pipe(
      tap(res =>this.cartCount.next(res.data.items.length))
    );
  }

  addItem(productId:string, quantity:number=1){
    return this._http.post<ICartRes>(`${this.apiURL}/add`, {productId , quantity}).pipe(
      tap(res => this.cartCount.next(res.data.items.length))
    );
  }

  updateItem(productId:string, quantity:number){
    return this._http.put<ICartRes>(`${this.apiURL}/update/${productId}`,{quantity});
  }

  removeItem(productId:string){
    return this._http.delete<ICartRes>(`${this.apiURL}/remove/${productId}`).pipe(
      tap(res => this.cartCount.next(res.data.items.length))
    );
  }

  clearCart(){
    return this._http.delete<ICartRes>(`${this.apiURL}/clear`).pipe(
      tap(() => this.cartCount.next(0))
    );
  }
}
