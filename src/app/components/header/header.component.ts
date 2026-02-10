import {Component, inject, OnInit} from '@angular/core';
import {NavigationService} from '../../shared/services/router-service';
import {SlideMenuComponent} from '../slide-menu/slide-menu.component';
import {SlideShoppingCartMenuComponent} from '../slide-cart-menu/slide-shopping-cart-menu.component';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    SlideMenuComponent,
    SlideShoppingCartMenuComponent
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private _isLoggedIn: boolean = false;
  protected router: NavigationService = inject(NavigationService);
  public toggleMenu: boolean = false;
  public toggleCart: boolean = false;

  public get cartNumber(): number {
   return this.cartService.howManyAreThere()
  }

  constructor(
    protected cartService: CartService,
    private _auth: AuthService,
    ) {}

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  public ngOnInit(): void {
    this._isLoggedIn = this._auth.isLoggedIn ?? false;
  }
}
