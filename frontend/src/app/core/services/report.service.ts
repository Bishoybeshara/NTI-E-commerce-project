import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { IOrder } from "../models/order.model";

export interface IOverallStats {
  totalRevenue : number;
  totalOrders: number
}

export interface ITopProduct {
  _id: string;
  name:string;
  image_url:string;
  totalQuantity:number;
  totalRevenue:number;
}

export interface IMonthlySales {
  _id:{year : number; month: number};
  totalRevenue:number;
  totalOrders: number;
}

export interface ITopUser {
  _id:string;
  name:string;
  email:string;
  totalSpent:number;
  totalOrders:number;
}


export interface ISalesReport {
  overallStats: IOverallStats[];
  topProducts: ITopProduct[];
  monthlySales:IMonthlySales[];
  topUsers:ITopUser[];
}

export interface IReportRes {
  status:string;
  data:ISalesReport;
}

@Injectable({providedIn:'root'})
export class ReportService{
  private readonly apiURL = environment.apiURL + 'report';

  constructor(private _http: HttpClient){}

  getSalesReport(startDate:string, endData:string){
    let params = new HttpParams();
    params = params.set('startDate' , startDate);
    params = params.set('endDate' , endData);
    return this._http.get<IReportRes>(`${this.apiURL}/sales` , {params});
  }
}
