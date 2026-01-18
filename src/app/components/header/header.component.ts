import {Component, inject} from '@angular/core';
import {NavigationService} from '../../services/router-service';
import {SlideMenuComponent} from '../slide-menu/slide-menu.component';

@Component({
  selector: 'app-header',
  imports: [
    SlideMenuComponent
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected router: NavigationService = inject(NavigationService);
  public toggleMenu: boolean = false;
}
