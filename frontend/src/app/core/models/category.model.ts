export interface ICategory {
  _id:string;
  name:string;
  is_deleted:boolean;
}

export interface ICategoriesRes {
  status: string;
  data:ICategory[];
}

export interface ISubcategory {
  _id:string;
  name:string;
  category:string;
}

export interface ISubcategoriesRes {
  status:string;
  data: ISubcategory[];
}
