import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {AdminComponent} from './pages/admin/admin.component';
import {ProductsComponent} from './pages/products/products.component';
import {RegisterComponent} from './pages/register/register.component';
import {OrderDetailsComponent} from './pages/order-details/order-details.component';

export const routes: Routes = [
  {
    path: 'logIn',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'order-details',
    component: OrderDetailsComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    component: HomeComponent
  },
  // {
  //   path: 'products',
  //   loadComponent: () =>
  //     import('../app/pages/products/products.component').then(m => m.ProductsComponent),
  //   canMatch: [productsGuard],
  // },

];
