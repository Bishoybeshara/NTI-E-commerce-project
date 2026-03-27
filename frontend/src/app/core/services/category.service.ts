import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { ICategoriesRes, ICategory, ISubcategoriesRes } from "../models/category.model";


@Injectable({providedIn:'root'})


export class CategoryService {
  private readonly apiURL = environment.apiURL + 'category';

  constructor(private _http:HttpClient){}

  getCategories(){
    return this._http.get<ICategoriesRes>(this.apiURL);
  }

  getSubCategories(categoryId :string){
    return this._http.get<ISubcategoriesRes>(`${this.apiURL}/${categoryId}/subcategories`)
  }

  addCategory(categoryData: { name: string; slug: string }) {
    return this._http.post<ICategoriesRes>(this.apiURL, categoryData);
  }

  addSubcategory(categoryId: string, subcategoryData: { name: string; slug: string; category: string }) {
  return this._http.post<ISubcategoriesRes>(`${this.apiURL}/${categoryId}/subcategories`, subcategoryData);
}
}
