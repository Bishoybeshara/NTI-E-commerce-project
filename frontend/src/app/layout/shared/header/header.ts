import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ITokenData } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive , AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private _authService = inject(AuthService);
  private _cartService = inject(CartService);


  // constructor(private _authService:AuthService,
  //   private _cartService:CartService
  // ){}

  userData: ITokenData| null = null;
  cartCount$ = this._cartService.cartCount$;

  ngOnInit(): void {
    this._authService.getAuthData().subscribe(data=>{
      this.userData = data;
    });
  }
  logout():void{
    this._authService.logout();
  }
}
