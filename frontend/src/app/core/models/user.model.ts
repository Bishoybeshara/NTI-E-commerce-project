export interface IUser {
  _id:string;
  name:string;
  email:string;
  phone:string;
  gender:'male' | 'female';
  address?:string;
  role:'user' | 'admin';
  is_active:boolean;
  createdAt:string;
}

export interface IUsersRes {
  status: string;
  data: IUser[];
}

export interface IUserRes {
  status:string;
  data: IUser;
}

export interface IUpdateProfileData {
  name?:string;
  phone?:string;
  address?:string;
}

export interface IChangePasswordData {
  currentPassword:string;
  newPassword: string;
}
