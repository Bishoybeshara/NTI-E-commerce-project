import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject , tap } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { environment } from "../../../environment/environment";
import { IAuthRes, ILoginData, IRegisterData, ITokenData } from "../models/auth.model";

// export interface ITokenData {
//   _id: string;
//   name: string;
//   role: string;
//   iat : number;
//   exp: number;
// }

@Injectable({providedIn:'root'})
export class AuthService {
  private readonly apiURL = environment.apiURL + 'auth';
  private readonly tokenKey = 'token';
  private authData = new BehaviorSubject<ITokenData | null>(null);

  constructor(private _http: HttpClient, private _router:Router){}

  authInit():void {
    const token = this.getToken();
    if(!token) return;
    const decode = this.decodeToken(token);
    if(this.isTokenValid(decode.exp)){
      this.authData.next(decode);
    } else {
      this.logout();
    }
  }

  getAuthData() {
    return this.authData.asObservable();
  }

  isLoggedIn():boolean{
    const token = this.getToken();
    if(!token) return false;
    return this.isTokenValid(this.decodeToken(token).exp);
  }


  isLoggedInWithRole(role:string): boolean {
    const token = this.getToken();
    if(!token) return false;
    const decode = this.decodeToken(token);
    return this.isTokenValid(decode.exp) && decode.role === role;
  }

  login(data: ILoginData){
    return this._http.post<IAuthRes>(`${this.apiURL}/login`, data).pipe(
      tap((res)=>{
        this.storeToken(res.token);
        const decode = this.decodeToken(res.token);
        this.authData.next(decode);
        this._router.navigate([decode.role === 'admin' ? '/dashboard' : '/home']);
      })
    );
  }

  register(data:IRegisterData){
    return this._http.post<IAuthRes>(`${this.apiURL}/register`, data).pipe(
      tap((res)=>{
        this.storeToken(res.token);
        const decode = this.decodeToken(res.token);
        this.authData.next(decode);
        this._router.navigate(['/home']);
      })
    );
  }

  logout(): void{
    this.removeToken();
    this.authData.next(null);
    this._router.navigate(['/login']);
  }

  getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }




  private storeToken (token : string):void {
    localStorage.setItem(this.tokenKey , token);
  }

  private removeToken (): void {
    localStorage.removeItem(this.tokenKey);
  }

  private decodeToken(token:string): ITokenData{
    return jwtDecode<ITokenData>(token);
  }

  private isTokenValid(exp:number):boolean{
    return Date.now() < exp * 1000 ;
  }
}
