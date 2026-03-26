export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface ITestimonial {
  _id:string;
  user:{_id:string; name:string};
  content:string;
  rating:number;
  status:TestimonialStatus;
  createdAt : string;
}

export interface ITestimonialsRes {
  status : string;
  data : ITestimonial[];
}

export interface ICreateTestimonial {
  content : string;
  rating : number;
}
