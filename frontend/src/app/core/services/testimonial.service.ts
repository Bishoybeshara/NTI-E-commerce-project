import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environment";
import { ITestimonialsRes , ICreateTestimonial , TestimonialStatus } from "../models/testimonial.model";

@Injectable({providedIn : 'root'})
export class TestimonialService {
  private readonly apiURL = environment.apiURL + 'testimonial';

  constructor(private _http:HttpClient){}

  getApprovedTestimonials(){
    return this._http.get<ITestimonialsRes>(this.apiURL);
  }


  createTestimonial(data:ICreateTestimonial){
    return this._http.post<ITestimonialsRes>(this.apiURL, data);
  }


  // admins

  getAllTestimonials(){
    return this._http.get<ITestimonialsRes>(`${this.apiURL}/all`);
  }

  updateStatus(id:string , status:TestimonialStatus){
    return this._http.put<ITestimonialsRes>(`${this.apiURL}/${id}/status` , {status});
  }
}

