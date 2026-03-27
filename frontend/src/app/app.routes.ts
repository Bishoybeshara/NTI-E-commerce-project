import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path:'',
    loadComponent : () => import ('./layout/layout/layout').then(b => b.Layout),
    children:[
      {path:'' , redirectTo:'home' , pathMatch:'full'},
      {path: 'home' , loadComponent:()=> import('./layout/home/home').then(b =>b.Home)},
      {path:'products' , loadComponent:()=> import('./layout/product-list/product-list').then(b => b.ProductList)},
      {path:'product/:slug' , loadComponent:()=> import('./layout/product-details/product-details').then(b =>b.ProductDetails)},
      {path:'cart' , loadComponent:()=> import('./layout/cart/cart').then(b => b.Cart)},
      {path:'checkout' , loadComponent:()=> import('./layout/checkout/checkout').then(b=>b.Checkout) , canActivate:[authGuard]},
      {path:'account' , loadComponent:()=> import('./layout/account/account').then(b =>b.Account) , canActivate:[authGuard]},
      {path:'testimonials' , loadComponent: ()=>import('./layout/testimonials/testimonials').then(b => b.Testimonials), canActivate:[authGuard]},
      {path:'pages/:slug' , loadComponent:()=> import('./layout/pages/pages').then(b => b.Pages)},
    ]
  },
  {
    path:'dashboard',
    loadComponent:()=> import('./dashboard/dashboard/dashboard').then(b =>b.Dashboard),
    canActivate:[adminGuard],
    children:[
      {path:'' , redirectTo:'home',pathMatch:'full' },
      {path:'home' , loadComponent:()=> import('./dashboard/dash-home/dash-home').then(b => b.DashHome)},
      {path:'products' , loadComponent:()=> import('./dashboard/products/products').then(b =>b.Products)},
      {path:'orders' , loadComponent:()=> import('./dashboard/orders/orders').then(b =>b.Orders)},
      {path:'users' , loadComponent:()=> import('./dashboard/users/users').then(b=>b.Users)},
      {path:'reports' , loadComponent:()=>import('./dashboard/reports/reports').then(b=>b.Reports)},
      {path:'testimonials' , loadComponent: ()=> import('./dashboard/testimonials/testimonials').then(b =>b.Testimonials)},
      {path: 'pages', loadComponent: () => import('./dashboard/pages/pages').then(b => b.Pages) },
      { path: 'categories', loadComponent: () => import('./dashboard/categories/categories').then(m => m.Categories)
}
    ]
  },
  {path:'login' , loadComponent:()=> import('./login/login').then( b => b.Login)},
  {path:'register' , loadComponent:()=> import('./register/register').then(b=>b.Register)},
  {path:'**' , loadComponent:()=>import('./not-found/not-found').then(b=>b.NotFound)}
];
