import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ordersListComponent} from '../../components/commands-list/orders-list.component';
import {ProductsServices} from '../../shared/services/products.services';
import {NotificationService} from '../../shared/services/notification.service';
import {catchError, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {VehiclesComponent} from './vehicles/vehicles.component';
import {PartsComponent} from './parts/parts.component';
import {OrdersComponent} from './orders/orders.component';
import {ProductComponent} from './product/product.component';

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    VehiclesComponent,
    PartsComponent,
    OrdersComponent,
    ProductComponent,
  ],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  public selectedTab: number = 2;


  public selectTab(nr: number): void {
    this.selectedTab = nr;
  }
}
