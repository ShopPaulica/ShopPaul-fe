import {DecimalPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, inject, input, Input, OnInit, output} from '@angular/core';
import {NavigationService} from '../../services/router-service';
import {ProductModel} from '../../shared/interfaces/product.model';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {ProductsServices} from '../../services/products.services';

@Component({
  selector: 'app-details-modal',
  imports: [NgForOf, NgIf, NgOptimizedImage, DecimalPipe],
  standalone: true,
  templateUrl: './details-modal.component.html',
  styleUrl: './details-modal.component.scss'
})
export class detailsModalComponent {
  protected router: NavigationService = inject(NavigationService);
  public openChange = output<boolean>();
  public selectedItem = input.required<ProductModel>() ;

  @Input() public set toggleMenu(bool: boolean) {
    this.isOpen = bool;
  }
  public isOpen = false;

  public get isInCart(): number {
    return this.selectedItem()?.id ? this.cartService.howManyAreOfOne(this.selectedItem()?.id) : 0;
  }

  constructor(private cartService: CartService) {}

  public closeMenu(): void {
    this.isOpen = false;
    this.openChange.emit(false)
  }

  public removeFromCart(): void {
    this.cartService.removeOne(this.selectedItem());
  }

  public addToCart(): void {
      this.cartService.addOne(this.selectedItem());
  }
}
