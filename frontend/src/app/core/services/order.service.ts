import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { IOrderRes , IOrdersRes , ICreateOrder, OrderStatus } from "../models/order.model";

@Injectable ({providedIn:'root'})
export class OrderService{
  private readonly apiURL = environment.apiURL + 'order';

  constructor(private _http:HttpClient){}

  createOrder(data:ICreateOrder){
    return this._http.post<IOrderRes>(this.apiURL , data);
  }


  getMyOrders(){
    return this._http.get<IOrdersRes>(`${this.apiURL}/my-orders`);
  }

  getOrderById(id:string){
    return this._http.get<IOrderRes>(`${this.apiURL}/my-orders/${id}`);
  }

  cancelOrder(id:string){
    return this._http.put<IOrderRes>(`${this.apiURL}/my-orders/${id}/cancel` , {});
  }


// admins
  getAllOrders(){
    return this._http.get<IOrdersRes>(this.apiURL);
  }

  updateOrderStatus(id:string, status:OrderStatus){
    return this._http.put<IOrderRes>(`${this.apiURL}/${id}/status`,{status});
  }
}
