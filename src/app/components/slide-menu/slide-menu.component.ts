import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, inject, input, Input, output } from '@angular/core';
import {NavigationService} from '../../services/router-service';

@Component({
  selector: 'app-cart-menu',
  imports: [NgForOf, NgIf, NgOptimizedImage],
  standalone: true,
  templateUrl: './slide-menu.component.html',
  styleUrl: './slide-menu.component.scss'
})
export class SlideMenuComponent {
  protected router: NavigationService = inject(NavigationService);
  public position = input<string>('right') ;
  public positionChange = output<boolean>();
  @Input() public set toggleMenu(bool: boolean) {
    this.isOpen = bool;
  }
  public isOpen = false;

  public closeMenu(): void {
    this.isOpen = false;
    this.positionChange.emit(false)
  }
}
