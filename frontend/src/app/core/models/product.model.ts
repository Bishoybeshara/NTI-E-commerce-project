export interface IProduct {
  _id:string;
  name:string;
  slug:string;
  description:string;
  price:number;
  priceAfterDiscount?:number;
  stock_quantity : number;
  image_url: string;
  category:{_id:string; name:string};
  subcategory:{_id:string; name:string};
  is_deleted:boolean;
  createdAt:string;
}

export interface IProductsRes {
  status: string;
  results:number;
  data:IProduct[];
}

export interface IProductRes {
  status:string;
  data:IProduct;
}

export interface IProductFilters {
  category?: string;
  subcategory?:string;
  search?:string;
}
