import { Injectable } from "@angular/core";
import { HttpClient , HttpParams } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { IProductRes , IProductsRes, IProductFilters } from "../models/product.model";

@Injectable({providedIn:'root'})
export class ProductService {
  private readonly apiURL = environment.apiURL + 'product';

  constructor(private _http : HttpClient){}


  getProducts(filters?: IProductFilters){
    let params = new HttpParams();
    if (filters?.category) params = params.set('category' , filters.category);
    if(filters?.subcategory) params = params.set('subcategory', filters.subcategory);
    if(filters?.search) params = params.set('search' , filters.search);

    return this._http.get<IProductsRes>(this.apiURL , {params});
  }

  getProductBySlug(slug:string){
    return this._http.get<IProductRes>(`${this.apiURL}/${slug}`)
  }

  addProduct(formData:FormData){
    return this._http.post<IProductRes>(this.apiURL , formData);
  }

  updateProduct(id:string, formData:FormData){
    return this._http.put<IProductRes>(`${this.apiURL}/${id}` , formData);
  }

  deleteProduct(id:string){
    return this._http.delete(`${this.apiURL}/${id}`)
  }

}




