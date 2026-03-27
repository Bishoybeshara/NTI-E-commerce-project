export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  is_deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoriesRes {
  status: string;
  results?: number;
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
