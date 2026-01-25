import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {CartServiceModel} from '../shared/interfaces/cart.service.model';
import {ProductModel} from '../shared/interfaces/product.model';
import {ShoppingCartProduct} from '../shared/interfaces/shopping-cart-product.model';


@Injectable({
  providedIn: 'root'
})
export class CartService implements CartServiceModel<ProductModel>{
  private cart: ShoppingCartProduct[] = [];


  //Securities measure and updatable for every client
  private readonly cartSubject: BehaviorSubject<ShoppingCartProduct[]>;
  readonly cart$: Observable<ShoppingCartProduct[]>;

  constructor() {
    this.cartSubject = new BehaviorSubject<ShoppingCartProduct[]>([]);
    this.cart$ = this.cartSubject.asObservable();
  }

  public get getTotal(): number {
    let total: number = 0
    this.cart.forEach(res => {
      total = total + (res.price * (res?.howMany ?? 0));
    })

    return total
  }

  public addMore(item: ProductModel, times: number): void {
    const itemFromTheCart: ShoppingCartProduct | undefined = this.cart.find((res: ShoppingCartProduct) => res.id === item.id)
    if(itemFromTheCart) {
      itemFromTheCart.howMany = times;
    } else {
      this.cart.push({...item, howMany: times});
    }
    this.fetchData();
  }

  public addOne(item: ProductModel): void {
    const itemFromTheCart: ShoppingCartProduct | undefined = this.cart.find((res: ShoppingCartProduct) => res.id === item.id)
    if(itemFromTheCart) {
      itemFromTheCart.howMany++
    } else {
      this.cart.push({...item, howMany: 1});
    }
    this.fetchData();
  }

  public removeAll(): void {
    this.cart = [];
    this.fetchData();
  }

  public removeMore(item: ShoppingCartProduct, times: number): void {
    if(item && item.howMany > 1) {
      item.howMany = times ;
    } else {
      this.cart = this.cart.filter((res) => res.id !== item.id)
    }
    this.fetchData();
  }

  public removeOne(item: ProductModel): void {
    const itemFromTheCart: ShoppingCartProduct | undefined = this.cart.find((res: ShoppingCartProduct) => res.id === item.id)

    if(itemFromTheCart && itemFromTheCart.howMany > 1) {
      itemFromTheCart.howMany = itemFromTheCart.howMany -1 ;
    } else {
      this.cart = this.cart.filter((res) => res.id !== item?.id)
    }
    this.fetchData();
  }

  public fetchData(): void {
    this.cartSubject.next(this.cart);
  }

  public howManyAreOfOne(id: number | undefined): number {
    return this.cart.find(product => product.id === id)?.howMany ?? 0
  }
}
