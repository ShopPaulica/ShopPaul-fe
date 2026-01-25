import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NavigationService} from '../../services/router-service';

@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected router: NavigationService = inject(NavigationService);
}
