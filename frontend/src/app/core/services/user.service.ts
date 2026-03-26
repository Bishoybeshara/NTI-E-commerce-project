import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { IUserRes , IUsersRes , IUpdateProfileData , IChangePasswordData } from "../models/user.model";

@Injectable ({providedIn:'root'})
export class UserService {
  private readonly apiURL = environment.apiURL + 'user';

  constructor(private _http:HttpClient){}

  getMyProfile(){
    return this._http.get<IUserRes>(`${this.apiURL}/me`);
  }

  updateMyProfile(data:IUpdateProfileData){
    return this._http.put<IUserRes>(`${this.apiURL}/me` , data);
  }

  changeMyPassword(data:IChangePasswordData){
    return this._http.put<IUserRes>(`${this.apiURL}/me/change-password` , data);
  }

  //admins
  getAllUsers(){
    return this._http.get<IUsersRes>(environment.apiURL + 'admin/users');
  }

  toggoleUserStatus(id:string){
    return this._http.put<IUserRes>(`${environment.apiURL}admin/users/${id}/toggle-status` , {});
  }
}
