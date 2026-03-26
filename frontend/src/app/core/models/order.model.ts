export type OrderStatus =
  | 'pending'
  | 'prepared'
  | 'shipped'
  | 'delivered'
  | 'cancelled_by_user'
  | 'cancelled_by_admin'
  | 'rejected';

export interface IOrderItem {
  product :string;
  name : string;
  image_url : string;
  quantity : number;
  unit_price : number;
}

export interface IOrder {
  _id: string;
  order_code : string;
  user : string;
  items: IOrderItem[];
  shipping_fee:number;
  total_amount:number;
  status:OrderStatus;
  phone:string;
  address:string;
  createdAt:string;
}


export interface IOrdersRes {
  status :string;
  data: IOrder[];
}

export interface IOrderRes {
  status:string;
  data:IOrder;
}

export interface ICreateOrder {
  phone : string;
  address:string;
}
