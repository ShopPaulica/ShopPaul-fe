import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, takeUntil, tap, throwError } from 'rxjs';

import { NotificationService } from '../../../shared/services/notification.service';
import { DATA_PROVIDER_TOKEN } from '../../../shared/services/admin/const/data-provider-token';
import { AdminCrudActionsBase } from '../models/admin-crud-actions';
import { OrderDTO } from '../../../shared/services/admin/orders/models/orderDTO';
import { OrdersState } from '../../../shared/services/admin/orders/models/order-state-model';
import { OrderArgs, IOrdersFilters } from '../../../shared/services/admin/orders/models/order-filters-model';
import { OrderFetchDataModel } from '../../../shared/services/admin/orders/models/order-fetch-data.model';
import { ProductsServices } from '../../../shared/services/products.services';
import { ProductModel } from '../../../shared/interfaces/product.model';
import {OrdersFacade} from '../../../shared/services/admin/orders/facade/orders-facade.service';

type EditableOrderItem = {
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  isCustom?: boolean;
};

@Component({
  selector: 'app-orders',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    DatePipe,
    DecimalPipe,
  ],
  providers: [
    {
      provide: DATA_PROVIDER_TOKEN,
      useExisting: OrdersFacade,
    }
  ],
  templateUrl: './orders.component.html',
  standalone: true,
  styleUrl: './orders.component.scss'
})
export class OrdersComponent extends AdminCrudActionsBase<OrderDTO, OrderArgs, OrdersState> implements OnInit {
  public orders: OrderDTO[] = [];

  public filters: IOrdersFilters = {
    name: '',
    email: '',
    phone: '',
    vin: '',
  };

  public isEditModalOpen = false;
  public editingOrderId = '';
  public editForm!: FormGroup;

  public editableItems: EditableOrderItem[] = [];
  public editOrderTotal = 0;

  public availableProducts: ProductModel[] = [];
  public selectedProductToAddId = '';

  constructor(
    fb: FormBuilder,
    @Inject(DATA_PROVIDER_TOKEN) protected override readonly dataProvider: OrdersFacade,
    private readonly _ns: NotificationService,
    private readonly _productsService: ProductsServices
  ) {
    super(fb, dataProvider);
  }

  public ngOnInit(): void {
    this.initGroupForm();
    this.initEditForm();
    this.initBase();
    this.loadAvailableProducts();
  }

  public onSearch(): void {
    this.currentPage = 1;
    this.fetchData();
  }

  public onReset(): void {
    this.filters = {
      name: '',
      email: '',
      phone: '',
      vin: '',
    };

    this.currentPage = 1;
    this.fetchData();
  }

  public prevPage(): void {
    if (this.currentPage <= 1 || this.isLoading) {
      return;
    }

    this.currentPage--;
    this.fetchData();
  }

  public nextPage(): void {
    if (this.currentPage >= this.totalPages || this.isLoading) {
      return;
    }

    this.currentPage++;
    this.fetchData();
  }

  public deleteData(id?: string): void {
    if (!id?.trim()) {
      this._ns.error('ID-ul comenzii lipsește.', {
        title: 'Delete Order',
        durationMs: 4000
      });
      return;
    }

    this.dataProvider.deleteData(id).subscribe({
      next: () => {
        this._ns.success('Comanda a fost ștearsă cu succes.', {
          title: 'Delete Order',
          durationMs: 4000
        });

        this.fetchData();
      },
      error: (err: HttpErrorResponse) => {
        this._ns.error(
          err?.error?.message ?? 'Nu am putut șterge comanda.',
          {
            title: 'Delete Order',
            durationMs: 4000
          }
        );
      }
    });
  }

  public openEditModal(order: OrderDTO): void {
    if (!order.id?.trim()) {
      this._ns.error('ID-ul comenzii lipsește.', {
        title: 'Edit Order',
        durationMs: 4000
      });
      return;
    }

    this.isLoading = true;
    this.editingOrderId = order.id;
    this.selectedProductToAddId = '';

    this.dataProvider.getOrderDetails(order.id).subscribe({
      next: (res) => {
        const item = res?.item;

        this.editForm.reset({
          name: item?.name || '',
          email: item?.email || '',
          phone: item?.phone || '',
          vin: item?.vin || '',
          description: item?.description || '',
        });

        const items = Array.isArray(item?.items) ? item.items : [];

        this.editableItems = items.map((entry: any) => {
          const qty = Number(entry?.qty ?? entry?.quantity ?? 1);
          const price = Number(entry?.price ?? 0);

          return {
            productId: entry?.productId || '',
            title: entry?.title || entry?.name || entry?.product?.name || '',
            price,
            quantity: qty,
            total: Number(entry?.total ?? (price * qty)),
            isCustom: Boolean(entry?.isCustom),
          };
        });

        this.recalculateOrderTotal();
        this.isEditModalOpen = true;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this._ns.error(
          err?.error?.message ?? 'Nu am putut încărca detaliile comenzii.',
          {
            title: 'Edit Order',
            durationMs: 4000
          }
        );
      }
    });
  }

  public closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingOrderId = '';
    this.editableItems = [];
    this.editOrderTotal = 0;
    this.selectedProductToAddId = '';

    this.editForm.reset({
      name: '',
      email: '',
      phone: '',
      vin: '',
      description: '',
    });
  }

  public addCustomItem(): void {
    this.editableItems.push({
      productId: '',
      title: '',
      price: 0,
      quantity: 1,
      total: 0,
      isCustom: true,
    });

    this.recalculateOrderTotal();
  }

  public addSelectedProduct(): void {
    if (!this.selectedProductToAddId) {
      this._ns.error('Selectează un produs.', {
        title: 'Add Product',
        durationMs: 3000
      });
      return;
    }

    const product = this.availableProducts.find((item) => item.id === this.selectedProductToAddId);

    if (!product) {
      this._ns.error('Produsul selectat nu a fost găsit.', {
        title: 'Add Product',
        durationMs: 3000
      });
      return;
    }

    this.editableItems.push({
      productId: product.id,
      title: product.name,
      price: Number(product.price || 0),
      quantity: 1,
      total: Number(product.price || 0),
      isCustom: false,
    });

    this.selectedProductToAddId = '';
    this.recalculateOrderTotal();
  }

  public removeItem(index: number): void {
    if (index < 0 || index >= this.editableItems.length) {
      return;
    }

    this.editableItems.splice(index, 1);
    this.recalculateOrderTotal();
  }

  public recalculateItem(index: number): void {
    const item = this.editableItems[index];

    if (!item) {
      return;
    }

    item.price = Number(item.price || 0);
    item.quantity = Math.max(Number(item.quantity || 1), 1);
    item.total = Number(item.price) * Number(item.quantity);

    this.recalculateOrderTotal();
  }

  public recalculateOrderTotal(): void {
    this.editOrderTotal = this.editableItems.reduce((sum, item) => {
      return sum + Number(item.total || 0);
    }, 0);
  }

  public saveEdit(): void {
    if (!this.editingOrderId.trim()) {
      this._ns.error('Lipsește ID-ul comenzii.', {
        title: 'Edit Order',
        durationMs: 4000
      });
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this._ns.error('Completează câmpurile necesare.', {
        title: 'Edit Order',
        durationMs: 4000
      });
      return;
    }

    if (!this.editableItems.length) {
      this._ns.error('Comanda trebuie să conțină cel puțin un produs.', {
        title: 'Edit Order',
        durationMs: 4000
      });
      return;
    }

    const raw = this.editForm.getRawValue();

    const payload: Partial<OrderDTO> = {
      name: raw.name?.trim() || '',
      email: raw.email?.trim() || '',
      phone: raw.phone?.trim() || '',
      vin: raw.vin?.trim() || '',
      description: raw.description?.trim() || '',
      items: this.editableItems.map((item) => ({
        productId: item.productId || '',
        title: item.title?.trim() || '',
        name: item.title?.trim() || '',
        price: Number(item.price || 0),
        qty: Number(item.quantity || 1),
        quantity: Number(item.quantity || 1),
        total: Number(item.total || 0),
        isCustom: Boolean(item.isCustom),
      })) as any,
      total: Number(this.editOrderTotal || 0),
    };

    this.isLoading = true;

    this.dataProvider.updateData(this.editingOrderId, payload).subscribe({
      next: () => {
        this._ns.success('Comanda a fost modificată cu succes.', {
          title: 'Edit Order',
          durationMs: 4000
        });

        this.closeEditModal();
        this.fetchData();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this._ns.error(
          err?.error?.message ?? 'Nu am putut modifica comanda.',
          {
            title: 'Edit Order',
            durationMs: 4000
          }
        );
      }
    });
  }

  protected initFilters(): void {
    this.fetchData();
  }

  protected initSubscription(): void {
    this.dataProvider.orders$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: OrderFetchDataModel | null) => {
        if (res) {
          this.orders = res.items ?? [];
          this.totalItems = res.totalItems ?? 0;
          this.totalPages = res.totalPages ?? 0;
          this.pageSize = res.pageSize ?? 0;
          this.currentPage = res.page ?? this.currentPage;
        } else {
          this.orders = [];
          this.totalItems = 0;
          this.totalPages = 0;
          this.pageSize = 0;
        }

        this.isLoading = false;
      });

    this.dataProvider.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.isLoading = loading;
      });
  }

  protected initGroupForm(): void {
    this.formGroup = this._fb.group({});
  }

  private initEditForm(): void {
    this.editForm = this._fb.group({
      name: ['', [Validators.required]],
      email: [''],
      phone: [''],
      vin: [''],
      description: [''],
    });
  }

  protected fetchData(): void {
    this.dataProvider.fetchData({
      name: this.filters.name?.trim() || '',
      email: this.filters.email?.trim() || '',
      phone: this.filters.phone?.trim() || '',
      vin: this.filters.vin?.trim() || '',
      page: String(this.currentPage),
    });
  }

  private loadAvailableProducts(): void {
    this._productsService.getProducts({ page: 1 }).subscribe({
      next: (res) => {
        this.availableProducts = res.items ?? [];
      },
      error: () => {
        this.availableProducts = [];
      }
    });
  }
}
