import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ordersListComponent} from '../../../components/commands-list/orders-list.component';
import {DropdownComponent} from '../../../components/dropdown/dropdown.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {PartsFacade} from '../../../shared/services/admin/parts/facade/parts-facade.service';
import {DATA_PROVIDER_TOKEN} from '../../../shared/services/admin/const/data-provider-token';
import {OrderDTO} from '../../../shared/services/admin/orders/models/orderDTO';
import {IOrdersFilters, OrderArgs} from '../../../shared/services/admin/orders/models/order-filters-model';
import {OrderFetchDataModel} from '../../../shared/services/admin/orders/models/order-fetch-data.model';
import {NotificationService} from '../../../shared/services/notification.service';
import {AdminCrudActionsBase} from '../models/admin-crud-actions';
import {OrdersState} from '../../../shared/services/admin/orders/models/order-state-model';
import {DataProviderModel} from '../../../shared/services/admin/model/data-provider-facade.model';
import {OrdersFacade} from '../../../shared/services/admin/orders/facade/orders-facade.service';


@Component({
  selector: 'app-orders',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    DropdownComponent,
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgIf,
    NgForOf,
  ],
  providers: [
    {
      provide: DATA_PROVIDER_TOKEN,
      useExisting: PartsFacade,
    }
  ],
  templateUrl: './orders.component.html',
  standalone: true,
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{

  public orders: OrderDTO[] = [];

  public filters: IOrdersFilters = {
    page: 1,
    name: '',
    email: '',
    phone: '',
    vin: '',
  };

  public isLoading = false;
  public currentPage = 1;
  public totalPages = 1;
  public totalItems = 0;
  public pageSize = 30;

  constructor(
   private dataProvider: OrdersFacade,
   private readonly _ns: NotificationService
  ) {
  }

  public ngOnInit(): void {
    this.loadOrders();
    this.initSubscription();
  }

  public loadOrders(): void {
    this.fetchData();
    this.isLoading = true;
  }

  public onSearch(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  public onReset(): void {
    this.filters = {
      page: 1,
      name: '',
      email: '',
      phone: '',
      vin: '',
    };
    this.currentPage = 1;
    this.loadOrders();
  }

  public prevPage(): void {
    if (this.currentPage <= 1 || this.isLoading) {
      return;
    }

    this.currentPage--;
    this.loadOrders();
  }

  public nextPage(): void {
    if (this.currentPage >= this.totalPages || this.isLoading) {
      return;
    }

    this.currentPage++;
    this.loadOrders();
  }

  public trackByOrderId(index: number, item: OrderDTO): string {
    return item.id;
  }

  public deleteData(id: string) {
    this.dataProvider.deleteData(id).subscribe({
      next: () => {
        this._ns.success('Comanda a fost ștearsă cu succes.', {
          title: 'Ștergere comandă',
          durationMs: 4000
        });
      },
      error: () => {
        this._ns.error('A apărut o eroare la ștergerea comenzii.', {
          title: 'Eroare ștergere comandă',
          durationMs: 4000
        });
      }
    });
  }

  private fetchData(): void {
    this.isLoading = true;
    this.dataProvider.fetchData({...this.filters, page: String(this.currentPage)});
  }

  private initSubscription(): void {
    this.dataProvider.orders$.pipe(
      //todo pipe destroy
    ).subscribe((res: OrderFetchDataModel | null)=> {
      if(res) {
      this.orders = res.items ?? [];
      this.totalItems = res.totalItems;
      this.totalPages = res.totalPages;
      this.pageSize = res.pageSize;
      }
      this.isLoading = false;
    })
  }
}
