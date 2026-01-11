import {Component, inject} from '@angular/core';
import {NavigationService} from '../../services/router-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected router: NavigationService = inject(NavigationService);
}
