import {DecimalPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'app-orders-list',
  imports: [NgForOf, NgIf, NgOptimizedImage, DecimalPipe],
  standalone: true,
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss'
})
export class ordersListComponent {

}
