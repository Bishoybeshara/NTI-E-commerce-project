export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: 'male' | 'female'
  address?: string;
}

export interface IAuthRes {
  status:string;
  token:string;
  data:{
    name:string;
    email:string;
    role:string;
  };
}

export interface ITokenData {
  _id:string;
  name:string;
  role: string;
  iat:number;
  exp:number;
}
