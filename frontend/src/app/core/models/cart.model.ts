export interface ICartProduct {
  _id:string;
  name:string;
  image_url:string;
  stock_quantity: number;
}

export interface ICartItem {
  _id:string;
  product: ICartProduct;
  quantity: number;
  unit_price: number;
}

export interface ICart {
  _id:string;
  items: ICartItem[];
  total_price:number;
}

export interface ICartRes {
  status :string;
  data: ICart;
}
