import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {AdminComponent} from './pages/admin/admin.component';
import {ProductsComponent} from './pages/products/products.component';

export const routes: Routes = [
  {
    path: 'logIn',
    component: LoginComponent
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
