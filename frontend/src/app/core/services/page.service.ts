import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environment";

export interface IPage {
  slug:string;
  title:string;
  content:string;
  updatedAt:string;
}

export interface IPageRes {
  status:string;
  data:IPage;
}

@Injectable({providedIn:'root'})
export class PageService{
  private readonly apiURL = environment.apiURL + 'page';

  constructor (private _http:HttpClient){}

  getPage(slug:'about' | 'contact' | 'faq'){
    return this._http.get<IPageRes>(`${this.apiURL}/${slug}`);
  }


  // Admins
  updatePage(slug:string, data:{title:string; content:string}){
    return this._http.put<IPageRes>(`${this.apiURL}/${slug}` , data);
  }
}
