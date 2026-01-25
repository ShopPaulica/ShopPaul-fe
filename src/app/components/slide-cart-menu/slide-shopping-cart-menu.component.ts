import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, EventEmitter, input, Input, output, Output} from '@angular/core';
import {ProductModel} from '../../shared/interfaces/product.model';

@Component({
  selector: 'app-slide-shopping-cart-menu',
  imports: [NgForOf, NgIf, NgOptimizedImage],
  standalone: true,
  templateUrl: './slide-shopping-cart-menu.component.html',
  styleUrl: './slide-shopping-cart-menu.component.scss'
})
export class SlideShoppingCartMenuComponent {
  @Output() public changeShoppingCart: EventEmitter<ProductModel[]> = new EventEmitter<ProductModel[]>();

   public position = input<string>('right') ;
  public positionChange = output<boolean>();
  @Input() public set toggleMenu(bool: boolean) {
    this.isOpen = bool;
  }

  @Input() public set setShoppingCart(shoppingCart: ProductModel[]) {
    this.shoppingCart = shoppingCart;
  }

  public shoppingCart: ProductModel[] = []
  public isOpen = false;
  //
  // public get getTotal(): number {
  //   let total: number = 0
  //   this.shoppingCart.forEach(res => {
  //     total = total + (res.price * (res?.howMany ?? 0));
  //   })
  //
  //   return total
  // }
  //
  // public closeMenu(): void {
  //   this.isOpen = false;
  //   this.positionChange.emit(false)
  // }
  //
  // public removeOne(item: ProductModel): void {
  //   if(item && (item?.howMany ?? 0) > 1) {
  //     if(!item?.howMany) {
  //       item.howMany = 0;
  //     }
  //     item.howMany--;
  //   } else {
  //     this.shoppingCart = this.shoppingCart.filter((res) => res.id !== item.id)
  //   }
  //   this.changeShoppingCart.emit(this.shoppingCart)
  // }
  //
  // public addOne(item: ProductModel): void {
  //   if(item) {
  //     if(!item?.howMany) {
  //       item.howMany = 0;
  //     }
  //     item.howMany++;
  //   }
  //   this.changeShoppingCart.emit(this.shoppingCart)
  // }
}
